const jwt = require('jsonwebtoken');

const {Auth} = require('../../api/models');

// !! CHECK IF USER WAS NOT DISABLED !!
//

const verifyToken = async (req, res, next) => {
    try {
        // Authorization header is not present on request
        console.log('req.headers', req.headers.authorization);
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: 'Unauthorized request, it must include an authorization header!'
            });
        } else {

            const token = await req.headers.authorization.split(' ')[1];
            console.log('token', token);

            // Token is not present on authorization header
            if (!token) {
                return res.status(401).json({
                    message: 'Unauthorized request, it must include an authorization token!'
                });
            }

            await jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
                if (err || !decoded) {
                    console.log('decode not successful');
                    return res.status(401).json({
                        message: 'Unauthorized request, it must have a valid authorization token!'
                    });
                } else {
                    console.log('decoded', decoded);
                    req.userId = decoded.subject;
                    console.log('we received the userId')
                    next();
                }
            });
        }
    } catch (err) {
            return sendErr(res, err);
        }
    };

    const isLoggedIn = async (req, res, next) => {
        try {
            const auth = await Auth.findOne({
                _user: req.userId,
                isLoggedIn: true,
                token: req.headers.authorization.split(' ')[1]
            });

            if (!!auth) {
                next();
            }

        } catch (err) {
            return sendErr(res, err, 'Unauthorized request, Please sign in to continue!', 401)
        }
    };

    module.exports = {
        verifyToken,
        isLoggedIn
    };
