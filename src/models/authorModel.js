const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema( {
    authorName: String,
    age: Number,
    ratings:Number,
    address: String
   
}, { timestamps: true });

module.exports = mongoose.model('NewAuthor', authorSchema)