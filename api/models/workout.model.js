const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const WorkoutSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    trainer: {
        type: Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    exercises: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Exercise'
        }
    ],
    exerciseData: [
        { sets: Number, weight: Number, reps: Array }
    ],
    instructions: {
        type: String
    },
    complete: {
        type: Boolean,
        default: false
    }
});

const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = Workout;
