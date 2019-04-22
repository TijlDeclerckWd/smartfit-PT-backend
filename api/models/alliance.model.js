const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const AllianceSchema = new Schema({
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    created_date: {
        type: Date,
        default: moment().format()
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    trainer: {
        type: Schema.Types.ObjectId,
        ref: 'Trainer'
    },
    updatesClient: [{ type : Schema.Types.ObjectId, ref: 'Update' }],
    updatesTrainer: [{ type : Schema.Types.ObjectId, ref: 'Update' }]

});

const Alliance = mongoose.model('Alliance', AllianceSchema);

module.exports = Alliance;
