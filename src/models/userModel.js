const mongoose = require('mongoose');

const userSchema = new mongoose.Schema( {
    firstName:{ type:String, required:true},
    lastName: String,
    mobile: {
        type: String,

        required: true
    },
    emailId: String,
    password: { type:String, required:true},
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    isDeleted: {
        type:Boolean,
        default:false}, //default value is false 
    age: Number,
    posts: {
        type: [], deafult: []}
}, { timestamps: true });

module.exports = mongoose.model('Authuser', userSchema)
