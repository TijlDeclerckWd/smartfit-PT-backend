const { Workout, Trainer, Client, Update } = require('../models');

const {
    sendErr
} = require('../../utils');

/*  =====================
 *  -- WORKOUT METHODS --
 *  =====================
 */

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
        .populate([
            {path: 'trainer'},
            {path: 'client'},
            {path: 'exercises'}
        ]
    );

    res.status(200).json({
        message: 'succesfully retrieved the recently chosen workouts',
        workouts
    })
};


module.exports = {
    createNewWorkout,
    getWorkout,
    loadRecentWorkouts,
    loadClientSchedule
};