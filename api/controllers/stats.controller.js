const { Workout, Stats, Exercise } = require('../models');
const moment = require('moment');

const {
    sendErr
} = require('../../utils');


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

const getWeightStats = async (req, res) => {
    try {
        const stats = await Stats.findOne({ client: req.userId });

        res.status(200).json({
            message: "succesfully retrieved the weight stats",
            data: stats.bodyWeight
        })
    } catch(err) {
        sendErr(res, err);
    }
}

const saveExerciseData = async (req, res) => {
    try {
        const { workoutId, exerciseNumber, exerciseId } = req.params;
        const data = req.body.data;

        console.log('checkpoint 1 data', data);

        const workout = await Workout.findOne({ _id: workoutId });

        console.log('checkpoint 2', workout);

        if (!workout) {
            sendErr(res, null, 'There is no such workout');
        }

        console.log('checkpoint 3', workout.exerciseData[parseInt(exerciseNumber, 10) - 1]);

        // add the reps to the exercise data in the workout document
        let exerciseData = workout.exerciseData[parseInt(exerciseNumber, 10) - 1];
        // add the array of reps to the data
        exerciseData.reps = req.body.data;

        // save the edited document
        const updatedWorkout = await workout.save();

        console.log('checkpoint 4', updatedWorkout);

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
//     use the rep total of first set as a reference
    console.log('checkpoint 4.5', exerciseData);

    const oneRM = Math.round(exerciseData.weight * (36 / (37 - exerciseData.reps[0])));

    console.log('checkpoint 5', oneRM);

    const stats = await Stats.findOne({ client: userId });

//     add this oneRM to the stats.oneRMS
    const RMData = { exercise: exerciseId, oneRM };
    stats.oneRMS.push(RMData);

    console.log('checkpoint 6', stats);

    // save the document
    await stats.save()
};

const calculateWeightLifted = async (exerciseId, userId, exerciseNumber, exerciseData) => {
    const stats = await Stats.findOne({client: userId});

    console.log('checkpoint 7', stats);

    // add the data to the stats document
    const convertedReps = exerciseData.reps.map((rep) => parseInt(rep, 10));
    const averageReps = convertedReps.reduce((tot, cur) => tot + cur)/convertedReps.length;
    const data = { exercise: exerciseId, weight: exerciseData.weight, reps: convertedReps, averageReps };
    stats.weightLiftedPerExercise.push(data);

    console.log('checkpoint 8', stats);

    // save the document
    await stats.save();
};

const updateMuscleGroupSets = async (exerciseId, userId, data) => {
  const exercise = await Exercise.findOne({ _id: exerciseId});
  const stats = await Stats.findOne({ client: userId });

  console.log('checkpoint 9', stats);

  exercise.targetMuscles.forEach( async (muscle) => {
      // we capitalize it because that's the way it is written as property
      const muscleCapitalized = muscle.charAt(0).toUpperCase() + muscle.slice(1);
      // every property that tracks weekly sets will begin with 'weekSets' + the muscle group
      const target = `weekSets${muscleCapitalized}`;
      console.log('checkpoint 10', target);
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

      console.log('checkpoint 11', matchedIndex);

      if (!matchedWeek) {
      //     we create a new week
          const newWeekData = {sets: 1};
          stats[target].push(newWeekData);
      } else {
          // we increment the sets of existing week with 1
          stats[target][matchedIndex].sets++;
      }

      const endState = await stats.save();
      console.log('checkpoint 12', endState);
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

        console.log('chest', chest);
        console.log('chest', back);
        console.log('chest', biceps);
        console.log('chest', triceps);

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
    getExerciseRMData,
    getExerciseVolumeData,
    getWeightStats,
    muscleGroupWeekData,
saveExerciseData
};