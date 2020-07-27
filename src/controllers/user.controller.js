const User = require('../models/user.models');
const status = require('http-status');

exports.login = async (req, res) => {

    let fn = `[POST] /Login`
    try {
        console.log(req.headers.authorization)
        let result = await User.findUserById('5f1e42c93641fb41a07864ef')
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