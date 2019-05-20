const jwt = require('jsonwebtoken');

const {
    sendErr, passwordHelper
} = require('../../utils');

const {
    Client,
    Trainer,
    Stats
} = require('../models');


/*  ==================
 *  -- AUTH METHODS --
 *  ==================
 */

const getId = async (res, req) => {
    try {
        if (req.userId) {
            res.status(200).json({
                userId: req.userId
            });
        }
    } catch(err) {
        sendErr(res, err);
    }
}

const signUp = async (req, res) => {
    try {
        const data = req.body;

        // create full name property to add to user doc
        data.fullName = `${data.firstName} ${data.lastName}`;

        // Encrypting user password
        const passEncrypted = await passwordHelper.encryptPassword(data.password);

        // Error creating the password
        if (!passEncrypted) {
            return sendErr(res, '', 'An error ocurred trying to create the password, please choose another password!', 401);
        }

        //  save the encrypted password in the user properties
        data.password = passEncrypted.password;

        // Differentiate between clients and trainers
        if (data.type === 'client') {
            const newClient = await Client.create(data);

            // create the stats document for this particular user
            const statsData = { client: newClient._id };
            const stats = await Stats.create(statsData);

            // add stats to client
            newClient.stats = stats._id;
            await newClient.save();

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
        sendErr(res, err);
    }
};

const signIn = (req, res) => {
    try {
        const data = req.body;
        data.type === 'trainer' ? signInTrainer(data, res) : signInClient(data, res)
    } catch (err) {
        sendErr(res, err);
    }
};

const signInTrainer = async (data, res) => {
    // find the trainer with this specific email
    const trainer = await Trainer.findOne({email: data.email});

    // If user wasn't found or user was previously removed/disabled, return error
    if (!trainer) {
        return sendErr(res, '', 'Please enter a valid email/password combination!', 401);
    }

    // we check whether the passwords match
    const passDecrypted = await passwordHelper.decryptPassword(data.password, trainer.password);

    // if there is no match of the passwords...
    if (!passDecrypted.password) {
        // we send a combination error
        return sendErr(res, '', 'Please enter a valid email/password combination!', 401);
    }

    // if there was an error, then we generate jsonwebtoken
    const payload = {
        // we should later add more data here that we can use in other server data handling tasks
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
    // find this specific client
    const client = await Client.findOne({email: data.email});

// If user wasn't found or user was previously removed/disabled, return error
    if (!client) {
        return sendErr(res, '', 'Please enter a valid email/password combination!', 401);
    }

    const passDecrypted = await passwordHelper.decryptPassword(data.password, client.password);

    if (!passDecrypted.password) {
        return sendErr(res, '', 'Please enter a valid email/password combination!', 401);
    }

    // Generate jsonwebtoken
    const payload = {
        subject: client._id
    };
    const token = await jwt.sign(payload, process.env.JWT_KEY);

    res.status(200).json({
        message: 'successfully logged in',
        token,
        userId: client._id,
        // we add this because we want to know whether this user already has a trainer,
        // our future navigation depends on this boolean
        trainerChosen: client.trainers.length > 0
    })
};


/*  =============
 *  -- EXPORTS --
 *  =============
 */

module.exports = {
    getId,
    signUp,
    signIn
};
