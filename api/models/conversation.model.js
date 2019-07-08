const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConversationSchema = new Schema({
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
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    seenMessages: {
       type: Number,
        default: 0
    }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
