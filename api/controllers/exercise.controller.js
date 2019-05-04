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
        const { name, videoLink, instructions, targetMuscles } = req.body;
        // we had to convert the array to JSON
        const bulletPoints = JSON.parse(req.body.bulletPoints);

        const data = {
            name,
            videoLink,
            instructions,
            targetMuscles,
            image: req.file.filename,
            bulletPoints
        };

        console.log('bullet points', bulletPoints);

        const newExercise = await Exercise.create(data);

        res.status(200).json({
            message: 'DONE',
            exercise: newExercise
        });
    } catch(err) {
        sendErr(res, err);
    }
};


module.exports = {
  createNewExercise
};
