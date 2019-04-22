const { Request, Update, Trainer } = require('../models');

const {
    sendErr
} = require('../../utils');


/*  ==================
 *  -- CLIENT METHODS --
 *  ==================
 */


const hasPickedTrainer = (req, res) => {
    console.log('req.userId', req.userId);

    res.status(200).json({
        hasPickedTrainer: true,
        userId: 'dfnjdnfjdnfjnfje'
    })
};

const sendHireRequest = async (req, res) => {
    try {
        // create the data for the new request we're about to make
        const request = {
            trainer: req.body.trainerId,
            client: req.userId,
            requestSentBy: 'client',
            type: 'hire',
            message: 'I would like to hire you as my personal trainer'
        };

        // create the new request
        const newRequest = await Request.create(request);

        // create update data
        const update  = {
            type: 'request',
            client: req.userId,
            trainer: req.body.trainerId,
            updateFrom: 'client',
            request: newRequest._id,
            text: 'I would like to hire you as my personal trainer'
        };

        // Create a new update
        const newUpdate = await Update.create(update);


        // add update to trainer updates property
        const updatedTrainer = await Trainer.findOneAndUpdate({ _id: req.body.trainerId }, {
            $addToSet: {
                updates: newUpdate._id
            }}, {
            new: true
        });

        console.log('updatedTrainer', updatedTrainer);
        // send positive response back to the browser
        res.status(200).json({
            message: "succesfully created hire request"
        })
    } catch(err) {
        sendErr(res, err, "an error occurred when we tried to send a hire Request, Please try again later.");
    }
};

const searchTrainer = async (req, res) => {
    try {
        const {input} = req.params;

        console.log('input check', input);

        const trainers = await Trainer.find({
            fullName: {$regex: input, $options: 'i'}
        });

        console.log('TRAINERS CHECK', trainers);

        res.status(200).json({
            message: 'successfully retrieved the trainers',
            trainers
        })
    } catch (err) {
        sendErr(res, err);
    }
};


module.exports = {
    hasPickedTrainer,
    sendHireRequest,
    searchTrainer
};
