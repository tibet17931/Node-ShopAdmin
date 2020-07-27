const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    // userId: ObjectId,
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    update_date: { type: Date, default: Date.now }
});

const USER = mongoose.model('USER', userSchema);

exports.findUserById = async (id) => {
    try {
        let result = await USER.findById(id)
        return result
    } catch (error) {
        throw error
    }
}

    // let saveUser = new User({ username: "admin", password: "9B70df49101", firstname: "Tibet", lastname: "Pedrod", })
    // saveUser.save(function (err, user) {
    //     if (err) return console.error(err);
    //     console.log(user.username + " saved to User collection.");
    // });

    // User.findById('5f1e42c93641fb41a07864ef', function (err, result) {
    //     if (err) {
    //         res.send(err);
    //     } else {
    //         // console.log(result)
    //         return res.status(status.OK).json({
    //             code: status.OK,
    //             message: result
    //         });
    //         // res.send(JSON.stringify(result));
    //     }
    // })


