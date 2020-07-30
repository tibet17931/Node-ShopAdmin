const jwt = require('jsonwebtoken')
const status = require('http-status');

exports.requireJWTAuth = (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' || req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            let token = req.headers.authorization.split(' ')[1];
            if (jwt.verify(token, process.env.SECRET))
                next()
        }
    } catch (error) {
        return res.status(status.UNAUTHORIZED).json({
            code: status.UNAUTHORIZED,
            message: `${error.toString()}`
        })
    }
}