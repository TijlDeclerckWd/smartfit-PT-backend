const { Workout, Stats, Exercise } = require('../models');
const moment = require('moment');

const {
    sendErr
} = require('../../utils');

const addNewWeight = async (req, res) => {
    try {
        const {userId} = req;
        const data = { weight: parseFloat(req.body.count.toFixed(1))};

        const updatedStats = await Stats.findOneAndUpdate({client: userId}, {
           $addToSet: { bodyWeight: data }
        }, {
            new: true
        }).select('bodyWeight');

        const newValue = updatedStats.bodyWeight.pop();

        res.status(200).json({
            message: 'done',
            newValue
        });
    } catch (err) {
        sendErr(res, err);
    }
};

const deleteWeight = async (req, res) => {
    try {
        const weightId = req.params.id;

        const statsDoc = await Stats.findOne({ client: req.userId });

        const index = statsDoc.bodyWeight.findIndex((weight) => weight._id == weightId);
        statsDoc.bodyWeight.splice(index, 1);
        await statsDoc.save();

        res.status(200).json({
            message: 'Successfully removed the weight'
        })
    } catch(err) {
        sendErr(res, err);
    }
};


const getExerciseRMData = async (req, res) => {
    try {
        const { exerciseId } = req.params;

        const stats = await Stats.findOne({ client: req.userId });

        const RMData = stats.oneRMS;
        const filteredRMData = RMData.filter((data) => {
            return data.exercise == exerciseId
        });

        res.status(200).json({
            message: 'succesfully retrieved the data',
            data: filteredRMData
        })
    } catch(err) {
        sendErr(res,err);
    }
};

const getTotalWorkouts = async (req, res) => {
    try {
        const stats = await Stats.findOne({ client: req.userId });

        res.status(200).json({
            data: stats.workoutsCompleted
        });
    } catch(err) {
        sendErr(res, err);
    }
};

const getWeightStats = async (req, res) => {
    try {
        const weight = await Stats.findOne({ client: req.userId }).select('bodyWeight');

        res.status(200).json({
            message: "succesfully retrieved the weight stats",
            data: weight
        })
    } catch(err) {
        sendErr(res, err);
    }
};

const saveExerciseData = async (req, res) => {
    try {
        const { workoutId, exerciseNumber, exerciseId } = req.params;
        const data = req.body.data;

        const workout = await Workout.findOne({ _id: workoutId });

        if (!workout) {
            sendErr(res, null, 'There is no such workout');
        }

        // add the reps to the exercise data in the workout document
        let exerciseData = workout.exerciseData[parseInt(exerciseNumber, 10) - 1];
        // add the array of reps to the data
        exerciseData.reps = req.body.data;

        // save the edited document
        const updatedWorkout = await workout.save();

        await calculateOneRM(updatedWorkout, exerciseId, req.userId, exerciseData);
        await calculateWeightLifted(exerciseId, req.userId, exerciseNumber, exerciseData);
        await updateMuscleGroupSets(exerciseId, req.userId, exerciseData);

        res.status(200).json({
            message: "successfully save the exercise data"
        });
    } catch (err) {
        sendErr(res, err);
    }
};

const calculateOneRM = async (workout, exerciseId, userId, exerciseData) => {
//    execute the bryzci formula;
//     use the rep total of first set as a referenc

    const oneRM = Math.round(exerciseData.weight * (36 / (37 - exerciseData.reps[0])));

    const stats = await Stats.findOne({ client: userId });

//     add this oneRM to the stats.oneRMS
    const RMData = { exercise: exerciseId, oneRM };
    stats.oneRMS.push(RMData);

    // save the document
    await stats.save()
};

const calculateWeightLifted = async (exerciseId, userId, exerciseNumber, exerciseData) => {
    const stats = await Stats.findOne({client: userId});


    // add the data to the stats document
    const convertedReps = exerciseData.reps.map((rep) => parseInt(rep, 10));
    const averageReps = convertedReps.reduce((tot, cur) => tot + cur)/convertedReps.length;
    const data = { exercise: exerciseId, weight: exerciseData.weight, reps: convertedReps, averageReps };
    stats.weightLiftedPerExercise.push(data);


    // save the document
    await stats.save();
};

const updateMuscleGroupSets = async (exerciseId, userId, data) => {
  const exercise = await Exercise.findOne({ _id: exerciseId});
  const stats = await Stats.findOne({ client: userId });


  exercise.targetMuscles.forEach( async (muscle) => {
      // we capitalize it because that's the way it is written as property
      const muscleCapitalized = muscle.charAt(0).toUpperCase() + muscle.slice(1);
      // every property that tracks weekly sets will begin with 'weekSets' + the muscle group
      const target = `weekSets${muscleCapitalized}`;
      // we want to check whether our date is between the start and end of the week
      const currentTime = moment();
      // we need this index to track the item that we need to update
      let matchedIndex;
      // is there a week in this array that corresponds to our current week?
      const matchedWeek = stats[target].find((week, index) => {
          if (currentTime.isBetween(moment(week.weekStart), moment(week.weekEnd), 'days', '[]')) {
              matchedIndex = index;
              return true;
          } else {
              return false;
          }
      });


      if (!matchedWeek) {
      //     we create a new week
          const newWeekData = {sets: 1};
          stats[target].push(newWeekData);
      } else {
          // we increment the sets of existing week with 1
          stats[target][matchedIndex].sets++;
      }

      const endState = await stats.save();
  })
};

const getExerciseVolumeData = async (req, res) => {
  try {
      const { userId } = req;
      const { exerciseId } = req.params;

      const stats = await Stats.findOne({ client: userId });

      const filteredData = stats.weightLiftedPerExercise.filter((item) => {
          return item.exercise == exerciseId;
      });

      res.status(200).json({
          message: "Successfully retrieved the data",
          data: filteredData
      });
  }  catch (err) {
      sendErr(res, err);
  }
};

const muscleGroupWeekData = async (req, res) => {
    try {
        const { beginWeek, endWeek } = req.body;

    //    now I want to go to every muscle group and pull out the week we're targeting
        const stats = await Stats.findOne({ client: req.userId });

        const chest = stats.weekSetsChest.find((week) => moment(week.weekStart).isSame(beginWeek, 'day') && moment(week.weekEnd).isSame(endWeek, 'day'));
        const back = stats.weekSetsBack.find((week) => moment(week.weekStart).isSame(beginWeek, 'day') && moment(week.weekEnd).isSame(endWeek, 'day'));
        const biceps = stats.weekSetsBiceps.find((week) => moment(week.weekStart).isSame(beginWeek, 'day') && moment(week.weekEnd).isSame(endWeek, 'day'));
        const triceps = stats.weekSetsTriceps.find((week) => moment(week.weekStart).isSame(beginWeek, 'day') && moment(week.weekEnd).isSame(endWeek, 'day'));
    //    add shoulders, quads and hamstrings later

        res.status(200).json({
            message: 'successfully retrieved',
            data: {
                biceps,
                triceps,
                chest,
                back
            }
        });


    } catch(err) {
        sendErr(res,err);
    }
};

module.exports = {
    addNewWeight,
    deleteWeight,
    getExerciseRMData,
    getExerciseVolumeData,
    getTotalWorkouts,
    getWeightStats,
    muscleGroupWeekData,
    saveExerciseData
};
