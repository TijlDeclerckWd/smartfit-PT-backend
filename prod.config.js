const init = () => {
    process.env.NODE_ENV = 'production';
    process.env.host = `https://smartfit-pt-backend.herokuapp.com/`;
    process.env.JWT_KEY = 'MDwwDQYJKoZIhvcNAQEBBQADKwAwKAIhAI4NtevVkBqWcQukvp9X4cCxh5ClhZ8k\n' +
        'DPQp+0FNM833AgMBAAE=';
    process.env.FILE_UPLOAD_FOLDER = `${__dirname}/uploads/`;
};

module.exports = { init };
