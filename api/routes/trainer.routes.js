const express = require('express');
const path = require('path');

const {
    trainerController
} = require('../controllers');

const {
    auth
} = require('../../utils');

const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/trainers/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

let upload = multer({ storage: storage }).single('profilePic');

const router = express.Router();

// -| Authentication |-

// Verify token and add current userId to request data
router.use(auth.verifyToken);
// Check if user is logged in
// router.use(auth.isLoggedIn);

// -| Routes |-

// Client is searching for a personal trainer
router.get('/getProfile/:trainerId', trainerController.getProfile);

// get recently registered trainers
router.get('/getRecentlyRegisteredTrainers', trainerController.getRecentlyRegisteredTrainers);

// get all the updates from a particular trainer
router.get('/getAllUpdates', trainerController.getAllUpdates);

// handle the request
router.put('/handleRequestResponse', trainerController.handleRequestResponse);

// load the schedule of the client
router.get('/loadClientSchedule/:clientId', trainerController.loadClientSchedule);

// load all the updates of a specific client
router.get('/loadClientUpdates/:clientId', trainerController.loadClientUpdates);

// upload the profile picture
router.post('/uploadProfilePic', upload, trainerController.uploadProfilePic);

module.exports = router;