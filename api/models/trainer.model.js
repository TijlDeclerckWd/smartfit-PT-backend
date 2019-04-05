const mongoose = require('mongoose');

const { Schema } = mongoose;

const TrainerSchema = new Schema({
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    full_name: {
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
    clients: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Trainee'
        }],
        default: []
    }
});

const Trainer = mongoose.model('Trainer', TrainerSchema);

module.exports = Trainer;
