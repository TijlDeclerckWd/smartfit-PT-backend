const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const StatsSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    workoutsCompleted: {
        type: Number,
        default: 0
    },
    bodyWeight: [
        { date: { type: String, default: moment().format()}, weight: Number }
    ],
    weekSetsShoulders: [
        {
            weekStart: { type: Date, default: moment().startOf('week') },
            weekEnd: { type: Date, default: moment().endOf('week') },
            sets: Number
        }
    ],
    weekSetsBack: [
        {
            weekStart: { type: Date, default: moment().startOf('week') },
            weekEnd: { type: Date, default: moment().endOf('week') },
            sets: Number
        }
    ],
    weekSetsChest: [
        {
            weekStart: { type: Date, default: moment().startOf('week') },
            weekEnd: { type: Date, default: moment().endOf('week') },
            sets: Number
        }
    ],
    weekSetsBiceps: [
        {
            weekStart: { type: Date, default: moment().startOf('week') },
            weekEnd: { type: Date, default: moment().endOf('week') },
            sets: Number
        }
    ],
    weekSetsTriceps: [
        {
            weekStart: { type: Date, default: moment().startOf('week') },
            weekEnd: { type: Date, default: moment().endOf('week') },
            sets: Number
        }
    ],
    weekSetsQuads: [
        {
            weekStart: { type: Date, default: moment().startOf('week') },
            weekEnd: { type: Date, default: moment().endOf('week') },
            sets: Number
        }
    ],
    weekSetsHamstrings: [
        {
            weekStart: { type: Date, default: moment().startOf('week') },
            weekEnd: { type: Date, default: moment().endOf('week') },
            sets: Number
        }
    ],
    oneRMS: [
        { exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' }, date: { type: Date, default: moment().format() }, oneRM: Number }
    ],
    weightLiftedPerExercise: [
        {   exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
            reps: [Number],
            weight: Number,
            date: { type: Date, default: moment().format() },
            averageReps: Number
        }
    ]
});

const Stats = mongoose.model('Stats', StatsSchema);

module.exports = Stats;
