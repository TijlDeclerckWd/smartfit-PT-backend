
const passwordHelper = require('./password');
const sendErr = require('./sendErr');
const exerciseFileHandler = require('./fileHandlers/exerciseFileHandler');

// auth/
const auth = require('./auth/auth');

module.exports = {
    auth,
exerciseFileHandler,
    passwordHelper,
    sendErr
};

