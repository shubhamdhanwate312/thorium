
const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId



const reviewSchema = new mongoose.Schema({

    bookId: {
        type: objectId,
        required: true,
        ref: "Book"
    },
    reviewedBy: {
        type: String,
        default: "Guest",
    },
    reviewedAt: {
        type: Date,
        default:Date.now()
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Review', reviewSchema)
