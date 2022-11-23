const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedOn: {
        type: Date,
        default: () => Date.now()
    },
    spn: {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        hash: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model('users', userSchema);