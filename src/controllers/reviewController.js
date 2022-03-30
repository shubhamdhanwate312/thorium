const reviewModel = require('../models/reviewModel')
const booksModel = require('../models/booksModel')
const ObjectId = require("mongoose").Types.ObjectId
// validation........................................................

const isValid = function (value) {
    if (typeof value == undefined || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}
const isValidRequestBody = function (requestBody) {
    return Object.entries((requestBody).length > 0)
}
////...........................................................................................................
const creatReview = async function (req, res) {
    try {
        const data = req.body
        const bookId = req.params.bookId
        if (!ObjectId(bookId)) return res.status(400).send({ status: false, message: "please provide valid id" })

        if (!isValidRequestBody) {
            return res.status(400).send({ status: false, message: "please provide review data" })
        }
        const { review, rating, reviewedAt, reviewedBy } = data
        if (!isValid(rating)) return res.status(400).send({ status: false, message: "please provide review rating" })


        if (!isValid(review)) return res.status(400).send({ status: false, message: "please provide review " })

        if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "please provide reviewrs name" })

        if (!isValid(bookId)) return res.status(400).send({ status: false, message: "please provide book id" })
        //book does not exit
        //validating rating

        if (rating < 1) return res.status(400).send({ status: false, message: "rating must be greater than 1" })
        if (rating > 5) return res.status(400).send({ status: false, message: "rating must be less than 5" })

        //validating reviewdAt
        data.reviewedAt = Date.now();

        const reviewDetails = await reviewModel.create(data)

        const countReview = await reviewModel.findByIdAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } })
        const details = {
            _id: reviewDetails._id,
            bookId: reviewDetails.bookId,
            reviewedBy: reviewDetails.reviewedBy,
            reviewedAt: reviewDetails.reviewedAt,
            rating: reviewDetails.rating,
            review: reviewDetails.review

        }

        return res.status(201).send({ status: true, message: "success", data: details })

    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: "error" })
    }
}
/////...........................................................................................................

const updatebyReviewId = async function (req, res) {

    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
        const Updation = req.body

        if (!ObjectId(bookId)) {
            return res.status(400).send({ status: false, message: 'please provide valid bookId' })
        }

        if (!ObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: 'please provide valid reviewId' })
        }

        const reviews = await reviewModel.findOne({ _id: reviewId, isDeleted: false })

        if (!reviews) {
            return res.status(404).send({ status: false, message: "No data found" })
        }

        if (!isValidRequestBody(Updation)) {
            return res.status(400).send({ status: false, message: 'please provide data for updation' })
        }

        const { review, rating, reviewedBy } = Updation

        if (!isValid(review)) {
            return res.status(400).send({ status: false, message: 'please provide title' })

        }

        if (!isValid(rating)) {
            return res.status(400).send({ status: false, message: 'please provide rating' })
        }

        if (!isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: 'please provide reviewersname' })

        }
        if (!isValid(bookId)) return res.status(400).send({ status: false, message: "please provide book id" })

        if (!isValid(reviewId)) return res.status(400).send({ status: false, message: "please provide review id" })
        const updateData = { review, rating, reviewedBy }

        const updated = await reviewModel.findOneAndUpdate({ _id: reviews }, { ...updateData }, { new: true })

        return res.status(200).send({ status: true, message: "review updated successfully", data: updated })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
};
////.............................................................................................

let deleteByReviewId = async function (req, res) {

    try {

        const bookId = req.params.bookId
        const Reviews = req.params.reviewId

        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is required in path params" })
        }

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: `enter a valid bookId` })
        }
        if (!Reviews) {
            return res.status(400).send({ status: false, message: "reviewId is required in path params" })
        }

        if (!isValid(Reviews)) {
            return res.status(400).send({ status: false, message: `enter a valid reviewId` })
        }

        const book = await booksModel.findOne({ _id: bookId, isDeleted: false })

        const review = await reviewModel.findOne({ _id: Reviews,isDeleted: false, deletedAt: null })

        if (!book) {
            return res.status(404).send({ status: false, message: "no book found by this ID" })
        }
        if (!review) {
            return res.status(404).send({ status: false, message: "no book found by this ID" })
        }

        const deletereview = await reviewModel.findByIdAndUpdate(Reviews, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })

        res.status(200).send({ status: true, message: "review deleted successfully" })


    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}

module.exports.creatReview = creatReview
module.exports.updatebyReviewId = updatebyReviewId
module.exports.deleteByReviewId = deleteByReviewId