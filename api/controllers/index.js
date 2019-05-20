const authController = require('./auth.controller');
const clientController = require('./client.controller');
const trainerController = require('./trainer.controller');
const exerciseController = require('./exercise.controller');
const workoutController = require('./workout.controller');
const statsController = require('./stats.controller');

module.exports = {
  authController,
    clientController,
    trainerController,
    exerciseController,
    workoutController,
    statsController
};
