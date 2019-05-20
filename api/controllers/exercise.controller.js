const { Exercise } = require('../models');

const {
sendErr
} = require('../../utils');



/*  ======================
 *  -- EXERCISE METHODS --
 *  ======================
 */

const createNewExercise = async (req, res) => {
    try {
        const { name, videoLink, instructions } = req.body;
        // we had to convert the array to JSON
        const bulletPoints = JSON.parse(req.body.bulletPoints);
        targetMuscles = [req.body.targetMuscles];

        const data = {
            name,
            videoLink,
            instructions,
            targetMuscles,
            image: req.file.filename,
            bulletPoints
        };

        const newExercise = await Exercise.create(data);

        res.status(200).json({
            message: 'DONE',
            exercise: newExercise
        });
    } catch(err) {
        sendErr(res, err);
    }
};

const getExerciseSearchResults = async (req, res) => {
    try {
        const {exerciseName} = req.params;

        const exercises = await Exercise.find({name: { $regex: exerciseName, $options: 'i' }});

        res.status(200).json({
            message: "Successfully retrieved the exercises",
            exercises
        })
    } catch (err) {
        sendErr(res, err);
    }
};

const getClientExercises = async (req, res) => {
    try {
        // this is a temporary solution, fix it later so that we return only the exercises that a client has data for
        const exercises = await Exercise.find({});

        res.status(200).json({
            message: "Succesfully retrieved",
            exercises
        });
    } catch (err) {
        sendErr(res, err);
    }
};


module.exports = {
  createNewExercise,
    getExerciseSearchResults,
    getClientExercises
};
