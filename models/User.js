const mongoose = require('mongoose')

const userModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avater: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
})

const User = mongoose.model('users', userModel)
module.exports = User