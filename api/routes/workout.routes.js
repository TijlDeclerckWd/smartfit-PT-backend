const express = require('express');
const {
    workoutController
} = require('../controllers');

const {

    auth
} = require('../../utils');


const router = express.Router();

// Verify token and add current userId to request data
router.use(auth.verifyToken);
// Check if user is logged in
// router.use(auth.isLoggedIn);

// -| Routes |-

// Client completed a workout
router.get('/completedWorkout/:workoutId', workoutController.completedWorkout);

// create new workout
router.post('/createNewWorkout', workoutController.createNewWorkout);

// load recent workouts
router.get('/loadRecentWorkouts/:clientId', workoutController.loadRecentWorkouts);

// load client schedule
router.get('/loadClientSchedule', workoutController.loadClientSchedule);

// get a specific workout
router.get('/getWorkout/:workoutId', workoutController.getWorkout);

module.exports = router;