const jwt = require('jsonwebtoken')
const status = require('http-status');
const multer = require('multer')
const path = require('path')

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("XXXXXXXXXXXXXXXXXXXXXx")
        cb(null, './public/');
    },
    filename: (req, file, cb) => {
        console.log("XXXXXXXXXXXXXXXXXXXXXx")
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log("XXXXXXXXXXXXXXXXXXXXXx")
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
        }
    }
});

exports.upload = upload
