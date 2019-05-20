
const passwordHelper = require('./password');
const sendErr = require('./sendErr');
const exerciseFileHandler = require('./fileHandlers/exerciseFileHandler');
const stats = require('./stats/stats');

// auth/
const auth = require('./auth/auth');

module.exports = {
    auth,
exerciseFileHandler,
    passwordHelper,
    stats,
    sendErr
};

