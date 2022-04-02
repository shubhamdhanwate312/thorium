const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const moment = require("moment")

const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true;
}


//1️⃣ Book Creation

const createBook = async function (req, res) {
  try {
    const bookBody = req.body
    if (Object.keys(bookBody) == 0) {
      return res.status(400).send({ status: false, message: 'bookDetails must be provided' })
    }

    const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = bookBody

    if (!isValid(title)) {
      return res.status(400).send({ status: false, message: 'title is required' })
    }

    let duplicateTitle = await bookModel.findOne({ title: title })

    if (duplicateTitle) {
      return res.status(400).send({ status: false, message: 'title alredy exists' })
    }

    if (!isValid(excerpt)) {
      return res.status(400).send({ status: false, message: 'excerpt is required' })
    }

    if (!isValid(userId)) {
      return res.status(400).send({ status: false, message: 'userId is required' })
    }

    const userNotInDB = await userModel.findById(userId)

    if (!userNotInDB) {
      return res.status(400).send({ status: false, msg: `${userId} not in DB ` })
    }

    if (!isValid(ISBN)) {
      return res.status(400).send({ status: false, message: 'ISBN is required' })
    }

    if (!(/^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(ISBN))) {
      return res.status(400).send({ status: false, message: 'please provide valid ISBN' })
    }

    let duplicateISBN = await bookModel.findOne({ ISBN: ISBN })

    if (duplicateISBN) {
      return res.status(400).send({ status: false, message: 'ISBN alredy exists' })
    }

    if (!isValid(category)) {
      return res.status(400).send({ status: false, message: 'category is required' })
    }
    if (!isValid(subcategory)) {
      return res.status(400).send({ status: false, message: 'subcategory is required' })
    }

    if (!isValid(releasedAt)) {
      return res.status(400).send({ status: false, message: 'releasedAt is required' })
    }

    if (!(/^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(bookBody.releasedAt))) {
      return res.status(400).send({ status: false, message: 'Invalid date format' })
    }

    const reqData = { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt: moment(releasedAt) }


    const newBook = await bookModel.create(reqData)
    return res.status(201).send({ status: true, data: newBook, message: "book created successfully" })

  }
  catch (error) {
    return res.status(500).send({ status: false, error: error.message })
  }
}



//2️⃣ Gets Books

const getBooks = async function (req, res) {

  try {
    const queryParams = req.query

    const book = await bookModel.find({ $and: [queryParams, { isDeleted: false }] }).select({ "_id": 1, "title": 1, "excerpt": 1, "userId": 1, "category": 1, "releasedAt": 1, "reviews": 1 }).sort({ "title": 1 })

    if (book.length > 0) {
      res.status(200).send({ status: true, count: book.length, message: 'Books list', data: book })
    }
    else {
      res.status(404).send({ msg: "book not found" })
    }

  } catch (error) {
    res.status(500).send({ status: true, message: error.message })
  }

}


//3️⃣Get Book By Id

const getBookById = async function (req, res) {
  try {
    const bookId = req.params.bookId

    if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
      return res.status(400).send({ status: false, message: 'please provide valid bookId' })
    }
    const findBook = await bookModel.findById({ _id: bookId, isDeleted: false })
    console.log(findBook)

    if (!findBook) {
      return res.status(404).send({ status: false, message: 'book not found' })
    }

    const review = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

    return res.status(200).send({ status: true, message: "Books List", data: { ...findBook.toObject(), reviewsData: review } })
  }

  catch (error) {
    return res.status(500).send({ status: false, error: error.message })
  }
}


//4️⃣ Upadated book

const updateBook = async function (req, res) {
  try {
    const bookId = req.params.bookId

    if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
      res.status(400).send({ status: false, message: 'please provide valid bookId' })
      return
    }

    const book = await bookModel.findById({ _id: bookId, isDeleted: false })
    console.log(book)

    if (!(book)) {
      res.status(404).send({ status: false, message: "No data found" })
      return
    }

    if (Object.keys(req.body) == 0) {
      res.status(400).send({ status: false, message: 'please provide data for updation' })
      return
    }

    const { title, excerpt, ISBN, releasedAt } = req.body

    if (!isValid(title)) {
      res.status(400).send({ status: false, message: 'please provide title' })
      return
    }

    const duplicateTitle = await bookModel.findOne({ title: title })
    if (duplicateTitle) {
      res.status(400).send({ status: false, message: "This title already in use ,please provide another one" })
      return
    }

    if (!isValid(excerpt)) {
      res.status(400).send({ status: false, message: 'please provide excerpt' })
      return
    }

    if (!isValid(ISBN)) {
      res.status(400).send({ status: false, message: 'please provide ISBN' })
      return
    }

    if (!(/^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(ISBN))) {
      return res.status(400).send({ status: false, message: 'please provide valid ISBN' })
    }

    const duplicateISBN = await bookModel.findOne({ ISBN: ISBN })
    if (duplicateISBN) {
      res.status(400).send({ status: false, message: "This ISBN already in use ,please provide another one" })
      return
    }

    if (!isValid(releasedAt)) {
      res.status(400).send({ status: false, message: 'please provide releasedAt' })
      return
    }
    if (!(/^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(releasedAt))) {
      return res.status(400).send({ status: false, message: 'please provide valid date in format (YYYY-MM-DD)' })
    }

    const updateData = { title, excerpt, ISBN, releasedAt: moment(releasedAt) }

    const updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { ...updateData }, { new: true })

    return res.status(200).send({ status: true, message: "Book updated successfully", data: updatedBook })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}



//5️⃣ Delete book by id

const deleteBookById = async function (req, res) {
  try {

    const bookId = req.params.bookId

    if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
      return res.status(400).send({ status: false, message: 'please provide valid bookId' })
    }

    const book = await bookModel.findOne({ _id: bookId })

    if (!book) {
      res.status(404).send({ status: false, message: 'bookId not found' })
      return
    }

    if (book.isDeleted == true) {
      res.status(400).send({ status: false, message: "Book is already deleted" })
      return
    }

    const deletedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } })

    res.status(200).send({ status: true, message: "Success", message: "Book deleted successfully" })
    return
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}

//✅
module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.getBookById = getBookById
module.exports.updateBook = updateBook
module.exports.deleteBookById = deleteBookById

















