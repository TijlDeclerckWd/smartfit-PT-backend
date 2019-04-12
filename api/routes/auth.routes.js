const express = require('express');
const {
    authController
} = require('../controllers');

const router = express.Router();

// sign up trainee
router.post('/signUp', authController.signUp);

// sign up trainer
router.post('/signIn', authController.signIn);


module.exports = router;