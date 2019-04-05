

const {
    sendErr, passwordHelper
} = require('../../utils');

const {
    Trainee
} = require('../models');





/*  ==================
 *  -- AUTH METHODS --
 *  ==================
 */


const signUp = async (req, res) => {
    try {
        console.log('entered the signup functin');
        const data = req.body;

        console.log('data', data);

        data.fullName = `${data.firstName} ${data.lastName}`;

        // Encrypting user password
        const passEncrypted = await passwordHelper.encryptPassword(data.password);

        // Error creating the password
        if (!passEncrypted) {
            console.log('failed password encryption');
            return sendErr(res, '', 'An error ocurred trying to create the password, please choose another password!', 401);
        }

        console.log('passEncrypted', passEncrypted);

        data.password = passEncrypted.password;

        const newTrainee = await Trainee.create(data);



        res.status(200).json({
            message: 'success'
        });
    } catch(err) {
console.log('ERRRR', err);
    }
};




/*  =============
 *  -- EXPORTS --
 *  =============
 */

module.exports = {
    signUp
};
