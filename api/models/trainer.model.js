const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const TrainerSchema = new Schema({
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    type: {
      type: String,
      required: true,
      default: 'trainer'
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
    clients: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Client'
        }
    ],
    updates: [{ type: Schema.Types.ObjectId, ref: 'Update' }],
    description: {
        type: String
    }
});

const Trainer = mongoose.model('Trainer', TrainerSchema);

module.exports = Trainer;
