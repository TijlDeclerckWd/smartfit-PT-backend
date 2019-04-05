const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const TraineeSchema = new Schema({
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        default: 'default_user.png'
    },
    mobile_number: {
        type: String,
        default: null
    },
    created_date: {
        type: Date,
        default: moment().format()
    },
    trainers: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Trainer'
        }],
        default: []
    }
});

const Trainee = mongoose.model('Trainee', TraineeSchema);

module.exports = Trainee;
