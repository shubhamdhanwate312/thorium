const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"],
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        reuqired: true,
        minlength: 8,
        maxlength: 15,      
    },
    address: {
        street: String,
        city: String,
        pincode: String,
    },

}, { timestamp: true }
);


module.exports = mongoose.model('User', userSchema);


