const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const clientRoutes = require('./client.routes');
const trainerRoutes = require('./trainer.routes');
const exerciseRoutes = require('./exercise.routes');
const workoutRoutes = require('./workout.routes');
const statsRoutes = require('./stats.routes');

module.exports = {
    authRoutes,
    clientRoutes,
    userRoutes,
    trainerRoutes,
    exerciseRoutes,
    workoutRoutes,
    statsRoutes
};
