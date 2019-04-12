const init = () => {
    process.env.NODE_ENV = 'development';
    process.env.PORT = '5000';
    process.env.host = `http://localhost:${process.env.PORT}/`;
    process.env.JWT_KEY = 'MDwwDQYJKoZIhvcNAQEBBQADKwAwKAIhAI4NtevVkBqWcQukvp9X4cCxh5ClhZ8k\n' +
        'DPQp+0FNM833AgMBAAE=';
    // process.env.SENDGRID_KEY = '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';
};

module.exports = { init };


// PRIVATE KEY JWT
// MIGqAgEAAiEAjg2169WQGpZxC6S+n1fhwLGHkKWFnyQM9Cn7QU0zzfcCAwEAAQIg
// DqTTMDCf3l3L4YtmKz8AApncmiLmkK7g8q/gs9KcfIECEQDNorXp0EnOKRw0y3eU
// OuOxAhEAsNhtBCG4jvg+/k3PW0p+JwIQEfkGrUjnKn2tWW/vI6WCAQIQCvzniSIv
// PXLfNx3OjHWMcQIRAIypKcxVcrVA6hnEjlOX5IE=