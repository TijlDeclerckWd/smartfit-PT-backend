const express = require('express');

const {
    statsController
} = require('../controllers');

const {
    auth
} = require('../../utils');

const router = express.Router();

// Verify token and add current userId to request data
router.use(auth.verifyToken);
// Check if user is logged in
// router.use(auth.isLoggedIn);


// add a new weight
router.post('/addNewWeight', statsController.addNewWeight);

// delete a weight input
router.delete('/deleteWeight/:id', statsController.deleteWeight);

// get exercise 1RM data
router.get('/getExerciseRMData/:exerciseId', statsController.getExerciseRMData);

// get exercise volume data
router.get('/getExerciseVolumeData/:exerciseId', statsController.getExerciseVolumeData);

// get the total amount of workouts
router.get('/getTotalWorkouts', statsController.getTotalWorkouts);

// get the weight stats of the client
router.get('/getWeightStats', statsController.getWeightStats);

// get the week data for every muscle group
router.post('/muscleGroupWeekData', statsController.muscleGroupWeekData);

// Save workout data
router.put('/saveExerciseData/:workoutId/:exerciseNumber/:exerciseId', statsController.saveExerciseData);


module.exports = router;
