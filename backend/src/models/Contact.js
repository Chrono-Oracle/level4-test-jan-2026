const { Schema, model } = require('mongoose');
const { required } = require('zod/mini');

const contactSchema  = new Schema({
    fullname: {
        type: String,
        required: true,
        min: [5, "Enter your full name"],
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        min: [3, "Please enter valid name ( > 3)"],
        max: [50, "Please enter valid name ( < 50)"],
    },
    addedBy: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Contact = model('contact', contactSchema);
module.exports = Contact;