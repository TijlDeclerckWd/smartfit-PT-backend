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

router.get('/hasPickedTrainer', clientController.hasPickedTrainer);


module.exports = router;