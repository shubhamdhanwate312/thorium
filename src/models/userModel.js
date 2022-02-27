const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookName: String,
    authorName: String,
    category: {
        type: String,
        enum: ["Horror", "Comic Book", "Detective"]

    },

    year: Number,

}, { timestamps: true });

module.exports = mongoose.model('book', bookSchema) //users



// String, Number
// Boolean, Object/json, array