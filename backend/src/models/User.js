const { Schema, model } = require('mongoose');
const { required } = require('zod/mini');

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        min: [3, "Enter a valid name with at least 3 characters"],
    },
    last_name: {
        type: String,
        required: true,
        min: [3, "Enter a valid name with at least 3 characters"],
    },
}, { timestamps: true });

const User = model('user', userSchema);
module.exports = User;