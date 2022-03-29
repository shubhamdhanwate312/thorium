const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        required: true,
        ref: "Book"
    },
    reviewedBy: {
        type: String,
        required: true,
        default: "Guest"
    },
    reviewedAt: {
        type: Date,
        required:true,
        format: new Date("YYYY-MM-DDTHH:MM:ssZ")
    },
    rating: {
        type: Number,
        minlength: 1,
        maxlength: 5,
        required: true
    },
    review:{
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
},{timestamps:true});

module.exports= mongoose.model('Review',reviewSchema)