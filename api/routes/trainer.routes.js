const express = require('express');

const {
    trainerController
} = require('../controllers');

const {
    auth
} = require('../../utils');

const router = express.Router();

// -| Authentication |-

// Verify token and add current userId to request data
router.use(auth.verifyToken);
// Check if user is logged in
// router.use(auth.isLoggedIn);

// -| Routes |-

// Client is searching for a personal trainer
router.get('/getProfile/:trainerId', trainerController.getProfile);

// get all the updates from a particular trainer
router.get('/getAllUpdates', trainerController.getAllUpdates);

router.put('/handleRequestResponse', trainerController.handleRequestResponse);

module.exports = router;