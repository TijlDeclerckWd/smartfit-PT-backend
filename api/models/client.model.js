const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const ClientSchema = new Schema({
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    type: {
        type: String,
        required: true,
        default: 'client'
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
        default: '/assets/images/default-profile-picture.png'
    },
    mobile_number: {
        type: String,
        default: null
    },
    created_date: {
        type: Date,
        default: moment().format()
    },
    data: {
        type: Schema.Types.ObjectId,
        ref: 'Clientdata'
    },
    trainers: [
        { type: Schema.Types.ObjectId, ref: 'Trainer' }
    ],
    updates: [
        { type: Schema.Types.ObjectId, ref: 'Update'}
    ],
    schedule: [
        { type: Schema.Types.ObjectId, ref: 'Workout' }
    ]
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
