const mongoose = require('mongoose');
const { Schema } = mongoose;


const MessageSchema = new Schema({
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
    sentBy: {
        type: String,
        enum: ['trainer', 'client'],
        required: true
    },
    date: {
type: Date,
        default: Date.now()
    },
    message: {
        type: String,
        required: true
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
