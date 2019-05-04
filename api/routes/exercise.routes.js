const express = require('express');
const path = require('path');

const {
    exerciseController
} = require('../controllers');

const {
   exerciseFileHandler,
    auth
} = require('../../utils');

// handle image uploads

const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/exercise/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

let upload = multer({ storage: storage }).single('attachment');

const router = express.Router();

// Verify token and add current userId to request data
router.use(auth.verifyToken);
// Check if user is logged in
// router.use(auth.isLoggedIn);


// -| Routes |-

// Create a new exercise
router.post('/createNewExercise', upload, exerciseController.createNewExercise);


module.exports = router;