const UserModel = require('../models/user.models');
const status = require('http-status');
const { calculate_age, hashPassword, isPasswordCorrect } = require('../helpers')
const clog = require('clog')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const sharp = require('sharp')
const isBase64 = require('is-base64');

exports.login = async (req, res) => {
    let fn = `[POST] /Login`
    try {
        let body = req.body;
        let result = await UserModel.getProfileByUsername(body.username)
        console.log(result)
        if (result) {
            //savedHash, savedSalt
            let checkPassword = isPasswordCorrect(result.password_hash, result.password_salt, body.password)
            if (checkPassword) {
                let payload = {
                    id: result._id,
                    sub: req.body.username
                };
                let token = jwt.sign(payload, process.env.SECRET, { expiresIn: '30m' })
                return res.status(status.OK).json({
                    code: status.OK,
                    message: {
                        fullname: result.firstname + ' ' + result.lastname,
                        avatar: `https://${req.get('host')}/${result.avatar}`,
                        token: token
                    }
                })
            } else {
                return res.status(status.BAD_REQUEST).json({
                    code: status.BAD_REQUEST,
                    message: "Password is Worng"
                })
            }
        } else {
            return res.status(status.BAD_REQUEST).json({
                code: status.BAD_REQUEST,
                message: "Username is Worng"
            })
        }
    } catch (error) {
        return res.status(status.BAD_REQUEST).json({
            code: status.BAD_REQUEST,
            message: `${fn}  ${error.toString()}`
        })
    }
}

exports.registor = async (req, res, next) => {
    let fn = `[POST] /Registor`
    try {
        let body = req.body;
        let filename;
        if (isBase64(body.avatar, { allowMime: true })) {
            filename = Date.now()
            let base64Image = body.avatar.split(';base64,').pop();
            fs.writeFileSync(`uploads/${filename}.png`, base64Image, { encoding: 'base64' })
        }
        let hash = hashPassword(body.password)
        let obj = {
            username: body.username,
            password_hash: hash.hash,
            password_salt: hash.salt,
            firstname: body.firstname,
            avatar: filename ? 'resize_' + filename + '.png' : 'default.png',
            lastname: body.lastname,
            email: body.email,
            birthday: new Date(body.birthday),
            phone: body.phone,
            age: calculate_age(new Date(body.birthday)),
        }
        clog.info(`obj : ${JSON.stringify(obj)}`)
        let result = await UserModel.registerModel(obj)
        clog.info(`result : ${JSON.stringify(result)}`)
        if (body.avatar) {
            await sharp(`uploads/${filename}.png`)
                .resize({ width: 500, height: 500 }).toFile(`uploads/resize_${filename}.png`)
            await fs.unlinkSync(`uploads/${filename}.png`)
        }
        return res.status(status.OK).json({
            code: status.OK,
            message: result
        })
    } catch (error) {
        return res.status(status.BAD_REQUEST).json({
            code: status.BAD_REQUEST,
            message: `${fn}  ${error.toString()}`
        })
    }
}

exports.getProfile = async (req, res) => {
    let fn = `[POST] /Registor`
    console.log(fn)
    try {
        let query = req.query;
        let result = await UserModel.getProfileByEmail(query.email)
        return res.status(status.OK).json({
            code: status.OK,
            message: result
        })
    } catch (error) {
        return res.status(status.BAD_REQUEST).json({
            code: status.BAD_REQUEST,
            message: `${fn}  ${error.toString()}`
        })
    }
}