const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')

const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

//creatReview

const createReview = async function (req, res) {
    try {
        const reviewBody = req.body

        const bookId = req.params.bookId

        if(Object.keys(reviewBody) == 0) {
            return res.status(400).send({ status: false, message: 'Please provide review details' })
        }

        if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
            return res.status(400).send({ status: false, message: 'please provide valid bookId' })
        }

        const book = await bookModel.findOne({_id:bookId,isDeleted:false})

        if (!book) {
            return res.status(404).send({ status: false, message: 'book not found' })
        }

        const { review, rating, reviewedBy, reviewedAt } = reviewBody

        if (!isValid(rating)) {
            return res.status(400).send({ status: false, message: 'rating is required' })
        }

        if (!isValid(reviewedAt)) {
            return res.status(400).send({ status: false, message: 'review date is required' })
        }

        if (!(/^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(reviewedAt))) {
            return res.status(400).send({ status: false, message: 'please provide valid date in format (YYYY-MM-DD)' })
        }

        if (reviewBody.rating < 1 || reviewBody.rating > 5 ) {
            res.status(400).send({ status: false, message: 'please provide ratings ( 1 - 5 )' })
            return
        }

        const reviewData = { bookId, rating, review, reviewedBy, reviewedAt: Date.now() }

        const addReview = await reviewModel.create(reviewData)

        book.reviews = book.reviews + 1
        await book.save()

        const data = book.toObject()
        data.reviewsData = addReview

        return res.status(201).send({ status: true, message: 'Review added successsfully', data: data })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//Update

const updateReviews = async function (req, res) {
    let getBookId = req.params.bookId;
    let getReviewId = req.params.reviewId
    let data = req.body;

    if (!data) {
         return res.status(400).send({ status: false, message: "enter data for update" }) 
        }

    let checkBookId = await bookModel.findOne({ _id: getBookId }, { isDeleted: false })

    if (!checkBookId) { 
        return res.status(400).send({ status: false, message: "no book exist with this id" })
     }

    let checkReviewId = await reviewModel.findOne({ _id: getReviewId , isDeleted: false })

    if (!checkReviewId) { 
        return res.status(400).send({ status: false, message: "no review exist with this id" }) 
    }
    if (data.rating < 1 || data.rating > 5 ) {
        res.status(400).send({ status: false, message: 'please provide ratings ( 1 - 5 )' })
        return
    }


    let updateReview = await reviewModel.findOneAndUpdate({ _id: getReviewId, bookId: getBookId },
        { $set: { review: data.review, rating: data.rating, reviewedBy: data.reviewedBy,reviewedAt:Date.now() } }, { new: true })

    return res.status(200).send({ status: true, message: "review updated successfully", data: updateReview })
}





// DELETE 


const deleteReviewById = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
            return res.status(400).send({ status: false, message: 'please provide valid bookId' })
        }
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            res.status(400).send({ status: false, message: "Book doesn't exist" })
            return
        }
        if (!(/^[0-9a-fA-F]{24}$/.test(reviewId))) {
            res.status(400).send({ status: false, message: 'please provide valid reviewId' })
            return
        }
        const review = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })
        if (!review) {
            res.status(400).send({ status: false, message: "review doesn't exist for given bookId" })
            return
        }

    
        const deletedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId }, { isDeleted: true }, { new: true })

        
        const decreaseCount = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } }) 
              res.status(200).send({ status: true, message: "review deleted successfully" })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({ status: false, message: error.message })
    }
}



module.exports.createReview = createReview
module.exports.updateReviews = updateReviews
module.exports.deleteReviewById = deleteReviewById

