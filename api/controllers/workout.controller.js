const { Workout, Trainer, Client, Update , Stats } = require('../models');

const {
    sendErr
} = require('../../utils');

/*  =====================
 *  -- WORKOUT METHODS --
 *  =====================
 */

const completedWorkout = async (req, res) => {
    try {
        const { workoutId } = req.params;

        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: req.params.workoutId, client: req.userId, complete: false },
            { complete: true}
            )
            .populate('trainer client');

        if (!updatedWorkout) {
            sendErr(res, null, "We did not find such a workout and thus can't update");
        }

        // update the stats
        await Stats.findOneAndUpdate({ client: req.userId },
            { $inc: { workoutsCompleted: 1 }});



        // Create an update that will let the trainer know that the workout is complete
        const updateData = {
            type: 'workout complete',
            workout: workoutId,
            text: `I have completed the exercise "${updatedWorkout.name}"`,
            trainer: updatedWorkout.trainer._id,
            client: updatedWorkout.client._id,
            updateFrom: 'client'
        };

        Update.create(updateData);

        res.status(200).json({
            message: "Successfully updated the workout"
        });

    } catch (err) {
        sendErr(res, err);
    }
};

const createNewWorkout = async (req, res) => {
    let data = req.body;
    data.trainer = req.userId;

    const newWorkout = await Workout.create(data);

    if (!newWorkout) {
        sendErr(res, null, "Unable to create the new workout")
    }

    // Now we want to create the update that will be displayed in the feed
    const updateData = {
        type: 'new workout',
        workout: newWorkout._id,
        trainer: newWorkout.trainer,
        client: newWorkout.client,
        updateFrom: 'trainer'
    };

    // create a new workout document


    const newUpdate = await Update.create(updateData);

    // add this new update to the trainer and the client
    await Trainer.findOneAndUpdate({_id: newWorkout.trainer}, {
        $push: {
            updates: newUpdate
        }
    });

    await Client.findOneAndUpdate({_id: newWorkout.client}, {
        $push: {
            updates: newUpdate
        }
    });

    res.status(200).json({
        message: "successfully created a new workout",
        workout: newWorkout
    });
};

const getWorkout = async (req, res) => {
  try {
      const { workoutId } = req.params;

      const workout = await Workout.findOne({ '_id': workoutId })
          .populate('trainer client exercises');

res.status(200).json({
    message: "successfully retrieved the workout",
    workout
})
  } catch (err) {
      sendErr(res, err);
  }
};

const loadClientSchedule = async (req, res) => {
    try {
        console.log('req.userId', req.userId);

        const workouts = await Workout.find({
            $and: [
                { client: req.userId },
                { complete: false },
                { date: { $gt: Date.now() }}
            ]
        })
            .sort('date')
            .populate('exercises');

        res.status(200).json({
            message: "Successfully retrieved the client's upcoming workouts",
            workouts
        })
    } catch(err) {
        sendErr(res, err);
    }
};

const loadRecentWorkouts = async (req, res) => {

    const {clientId} = req.params;

    const workouts = await Workout.find(
        {
            $and: [
                { 'trainer': req.userId },
                { 'client': clientId }
            ]
        })
        .sort('-date')
        .limit(5)
        .populate([
            { path: 'trainer' },
            { path: 'client' },
            { path: 'exercises' }
        ]
    );

    res.status(200).json({
        message: 'succesfully retrieved the recently chosen workouts',
        workouts
    })
};

const saveExerciseData = async (req, res) => {
  try {
      const { workoutId, exerciseNumber, exerciseId } = req.params;

      const workout = await Workout.findOne({ _id: workoutId });

      if (!workout) {
          sendErr(res, null, 'There is no such workout');
      }

      // add the reps to the exercise data in the workout document
      let exerciseData = workout.exerciseData[parseInt(exerciseNumber, 10) - 1];
      // add the array of reps to the data
      exerciseData.reps = req.body.data;

      // save the edited document
      await workout.save();



      res.status(200).json({
          message: "successfully save the exercise data"
      });
  } catch (err) {
      sendErr(res, err);
  }
};


module.exports = {
    createNewWorkout,
    getWorkout,
    loadRecentWorkouts,
    loadClientSchedule,
    saveExerciseData,
    completedWorkout
};