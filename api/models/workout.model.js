const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const WorkoutSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['muscle', 'cardio']
    },
    trainer: {
        type: Schema.Types.ObjectId,
        ref: 'Trainer'
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    exercises: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Exercise'
        }
    ],
    notes: {
        type: String
    }
});

const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = Workout;
