const mongoose = require('mongoose');

const { Schema } = mongoose;

const UpdateSchema = new Schema({
    type: { type: String, required: true, enum: ['request', 'workout'] },
    request: { type: Schema.Types.ObjectId, ref: 'Request' },
    workout: { type: Schema.Types.ObjectId, ref: 'Workout' },
    text: { type: String },
    trainer: { type: Schema.Types.ObjectId, ref: 'Trainer' },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    updateFrom: { type: String, enum: ['trainer', 'client'] },
    response: { type: String, default: ''},
    date: { type: Date, default: Date.now() },
    seen: { type: Boolean, default: false }
});

const Update = mongoose.model('Update', UpdateSchema);

module.exports = Update;
