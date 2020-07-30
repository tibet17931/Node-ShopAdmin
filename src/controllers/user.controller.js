const UserModel = require('../models/user.models');
const status = require('http-status');
const { calculate_age, hashPassword, isPasswordCorrect } = require('../helpers')
const clog = require('clog')
const jwt = require('jsonwebtoken')
const fs = require('fs');

exports.login = async (req, res) => {
    let fn = `[POST] /Login`
    try {
        let body = req.body;
        let result = await UserModel.getProfileByUsername(body.username)
        if (result) {
            //savedHash, savedSalt
            let checkPassword = isPasswordCorrect(result.password_hash, result.password_salt, body.password)
            if (checkPassword) {
                let payload = {
                    sub: req.body.username
                };
                let token = jwt.sign(payload, process.env.SECRET, { expiresIn: '30m' })
                return res.status(status.OK).json({
                    code: status.OK,
                    message: { token: token }
                })
            } else {
                return res.status(status.FORBIDDEN).json({
                    code: status.FORBIDDEN,
                    message: "Password is Worng"
                })
            }
        } else {
            return res.status(status.FORBIDDEN).json({
                code: status.FORBIDDEN,
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
        // console.log(req.files[0].buffer)
        fs.writeFileSync('/uploads', 'Hey there!')
        // let body = req.body;
        // let hash = hashPassword(body.password)
        // let obj = {
        //     username: body.username,
        //     password_hash: hash.hash,
        //     password_salt: hash.salt,
        //     firstname: body.firstname,
        //     lastname: body.lastname,
        //     email: body.email,
        //     birthday: new Date(body.birthday),
        //     phone: body.phone,
        //     age: calculate_age(new Date(body.birthday)),
        // }
        // clog.info(`obj : ${JSON.stringify(obj)}`)
        // let result = await UserModel.registerModel(obj)
        // clog.info(`result : ${JSON.stringify(result)}`)
        // return res.status(status.OK).json({
        //     code: status.OK,
        //     message: result
        // })
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