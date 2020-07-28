const UserModel = require('../models/user.models');
const status = require('http-status');
const { calculate_age, hashPassword, isPasswordCorrect } = require('../helpers')
const clog = require('clog')

exports.login = async (req, res) => {
    let fn = `[POST] /Login`
    try {
        console.log(req.headers.authorization)
        let result = await UserModel.findUserById('5f1e42c93641fb41a07864ef')
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

exports.registor = async (req, res) => {
    let fn = `[POST] /Registor`
    try {
        let body = req.body;
        let hash = hashPassword(body.password)
        let obj = {
            username: body.username,
            password_hash: hash.hash,
            password_salt: hash.salt,
            firstname: body.firstname,
            lastname: body.lastname,
            email: body.email,
            birthday: new Date(body.birthday),
            phone: body.phone,
            age: calculate_age(new Date(body.birthday)),
        }
        clog.info(`obj : ${JSON.stringify(obj)}`)
        let result = await UserModel.registerModel(obj)
        clog.info(`result : ${JSON.stringify(result)}`)
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