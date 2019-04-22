const mongoose = require('mongoose');
const { Schema } = mongoose;


const RequestSchema = new Schema({
    active: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        enum: ['hire'],
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    trainer: {
        type: Schema.Types.ObjectId,
        ref: 'trainer',
        required: true
    },
    requestSentBy: {
        type: String,
        enum: ['trainer', 'client'],
        required: true
    },
    message: {
        type: String
    },
    response: {
        type: String,
        enum: ['confirmed', 'denied']
    }
});

const Request = mongoose.model('Request', RequestSchema);

module.exports = Request;
