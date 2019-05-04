const mongoose = require('mongoose');

const { Schema } = mongoose;

const ExerciseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number
    },
    image: {
      type: String,
      default: 'default_user.png'
    },
    instructions: {
        type: String
    },
    videoLink: {
        type: String
    },
    targetMuscles: {
        type: String
    },
    bulletPoints: {
        type: Array
    }
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;
