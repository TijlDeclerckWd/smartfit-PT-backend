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

router.get('/hasPickedTrainer', clientController.hasPickedTrainer);

// client sends a hire request to a personal
router.post('/sendHireRequest', clientController.sendHireRequest);

// Client is searching for a personal trainer
router.get('/searchTrainer/:input', clientController.searchTrainer);

module.exports = router;