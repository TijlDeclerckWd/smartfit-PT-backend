const jwt = require('jsonwebtoken');

const {
    sendErr, passwordHelper
} = require('../../utils');

const {
    Client,
    Trainer
} = require('../models');


/*  ==================
 *  -- AUTH METHODS --
 *  ==================
 */

const signUp = async (req, res) => {
    try {

        const data = req.body;
        console.log('DATA SIGNUP', data);

        data.fullName = `${data.firstName} ${data.lastName}`;

        // Encrypting user password
        const passEncrypted = await passwordHelper.encryptPassword(data.password);

        // Error creating the password
        if (!passEncrypted) {
            return sendErr(res, '', 'An error ocurred trying to create the password, please choose another password!', 401);
        }

        data.password = passEncrypted.password;

        if (data.type === 'client') {
            const newClient = await Client.create(data);

            return res.status(200).json({
                message: 'success',
                newClient
            });
        } else if (data.type === 'trainer') {
            const newTrainer = await Trainer.create(data);

            return res.status(200).json({
                message: 'Success',
                newTrainer
            })

        }




    } catch (err) {
        console.log('Error', err);
    }
};

const signIn = (req, res) => {
    try {
        const data = req.body;

        data.type === 'trainer' ? signInTrainer(data, res) : signInClient(data, res)
    } catch (err) {
        console.log('error', err);
    }
};

const signInTrainer = async (data, res) => {
    const trainer = await Trainer.findOne({ email: data.email });

    // If user wasn't found or user was previsously removed/disabled, return error
    if (!trainer) {
        return sendErr(res, '', 'Please enter a valid email/password combination!', 401);
    }

    const passDecrypted = await passwordHelper.decryptPassword(data.password, trainer.password);

    if (!passDecrypted.password) {
        return sendErr(res, '', 'Please enter a valid email/password combination!', 401);
    }

    // Generate jsonwebtoken
    const payload = {
        subject: trainer._id
    };
    const token = await jwt.sign(payload, process.env.JWT_KEY);

    res.status(200).json({
        message: 'successfully logged in',
        token,
        userId: trainer._id
    })
};

const signInClient = async (data, res) => {
    console.log('checkpoint 1', data);
    const client = await Client.findOne({ email: data.email });

    console.log('checkpoint 2', client);

// If user wasn't found or user was previsously removed/disabled, return error
    if (!client) {
        return sendErr(res, '', 'Please enter a valid email/password combination!', 401);
    }

    const passDecrypted = await passwordHelper.decryptPassword(data.password, client.password);

    console.log('checkpoint 3, passd', passDecrypted);

    if (!passDecrypted.password) {
        return sendErr(res, '', 'Please enter a valid email/password combination!', 401);
    }

    // Generate jsonwebtoken
    const payload = {
        subject: client._id
    };
    const token = await jwt.sign(payload, process.env.JWT_KEY);

    console.log('checkpoint 4', token);


    res.status(200).json({
        message: 'successfully logged in',
        token,
        userId: client._id,
        trainerChosen: client.trainers.length > 0
    })
};


/*  =============
 *  -- EXPORTS --
 *  =============
 */

module.exports = {
    signUp,
    signIn
};
