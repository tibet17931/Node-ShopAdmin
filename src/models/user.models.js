const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    // userId: ObjectId,
    username: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    password_salt: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    birthday: { type: Date, required: true },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required'],
        unique: true
    },
    age: { type: Number, min: 15, max: 65 },
    update_date: { type: Date, default: Date.now }
});

userSchema.plugin(uniqueValidator);

const USER = mongoose.model('USER', userSchema);

exports.findUserById = async (id) => {
    try {
        let result = await USER.findById(id)
        return result
    } catch (error) {
        throw error
    }
}

exports.registerModel = async (obj) => {
    try {
        let saveUser = new USER(obj)
        let result = await saveUser.save()
        return result
    } catch (error) {
        throw error
    }
}

exports.getProfileByEmail = async (email) => {
    try {
        let result = await USER.findOne({ email: { $regex: '.*' + email + '.*' } })
        return result
    } catch (error) {
        throw error
    }
}

exports.getProfileByUsername = async (username) => {
    try {
        let result = await USER.findOne({ username: username })
        return result
    } catch (error) {
        throw error
    }
}



exports.USER = USER