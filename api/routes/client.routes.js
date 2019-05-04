const express = require('express');

const {
    clientController
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

// to check whether this client has already picked a trainer
router.get('/hasPickedTrainer', clientController.hasPickedTrainer);

// return all the updates of a certain client
router.get('/loadAllUpdates', clientController.loadAllUpdates);

// client sends a hire request to a personal trainer
router.post('/sendHireRequest', clientController.sendHireRequest);

// Client is searching for a personal trainer, we provide him with a list of possibilities based on input
router.get('/searchTrainer/:input', clientController.searchTrainer);

module.exports = router;