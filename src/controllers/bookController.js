const booksModel = require("../models/bookModel");
const userModel = require('../models/userModel');
const reviewModel = require('../models/reviewModel');


const isValid = function (value) {
  if (typeof value == undefined || value == null || value.length == 0) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}
const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}



//1️⃣Create book ...............................................

const createBook = async function (req, res) {
  try {
      const bookBody = req.body
      if(!isValidRequestBody(bookBody)) {
          return res.status(400).send({status: false, message: 'Please provide book details'})
      }

      const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = bookBody

      if(!isValid(title)) {
          return res.status(400).send({status: false, message: 'title is required'})
      }

      const duplicateTitle = await bookModel.findOne({title: title})

      if(duplicateTitle) {
          return res.status(400).send({status: false, message: 'Title already exist'})
      }

      if(!isValid(excerpt)) {
          return res.status(400).send({status: false, message: 'excerpt is required'})
      }

      if(!isValid(userId)) {
          return res.status(400).send({status: false, message: 'userId is required'})
      }

      if(!isValid(ISBN)) {
          return res.status(400).send({status: false, message: 'ISBN is required'})
      }

      const duplicateISBN = await bookModel.findOne({ISBN: ISBN})

      if(duplicateISBN) {
          return res.status(400).send({status: false, message: 'ISBN already exist'})
      }

      if(!isValid(category)) {
          return res.status(400).send({status: false, message: 'category is required'})
      }

      if(!isValid(subcategory)) {
          return res.status(400).send({status: false, message: 'subcategory is required'})
      }

      if(!isValid(reviews)) {
          return res.status(400).send({status: false, message: 'reviews is required'})
      }

      if(!isValid(releasedAt)) {
          return res.status(400).send({status: false, message: 'releasedAt is required'})
      }

      if(!(/^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(bookBody.releasedAt))) {
          return res.status(400).send({ status: false, message: "Plz provide valid released Date" })
        }
      
      const userPresent = await userModel.findById(userId)

      if(!userPresent) {
          return res.status(400).send({status: false, message: `userId ${userId} is not present`})
      }

      const reqData = { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt:moment(releasedAt) }

      const bookCreated = await bookModel.create(reqData)
      return res.status(201).send({status: true, message: 'Book Successfully Created', data: bookCreated})

  }
  catch(error) {
      return res.status(500).send({status: false, error: error.message})
  }
}


//2️⃣ GET BOOKS ........

const getbook = async function (req, res) {
  try {
    const data = req.query
    const filter = {
      ...data,
      isDeleted: false
    }
    const Books = await booksModel.find(filter).select({
      title: 1, excerpt: 1, userId: 1, category: 1,
      releasedAt: 1, reviews: 1
    }).sort({ title: 1 })// arrange like alphabetical oreder

    if (Books.length === 0) {
      return res.status(404).send({ status: true, message: "no books found." })
    }

    res.status(200).send({ status: true, message: "books list", data: Books })
  }

  catch (err) {
    return res.status(500).send({ status: true, ERROR: err.message })

  }
}


//3️⃣GET BOOKS BY ID  .................................

let getbookdetailsById = async function (req, res) {
  try {

    const bookId = req.params.bookId

    if (!bookId) {
      return res.status(400).send({ status: false, message: "bookId is required in path params" })
    }

    if (!isValid(bookId)) {
      return res.status(400).send({ status: false, message: `enter a valid bookId` })
    }

    const bookById = await booksModel.findOne({ _id: bookId, isDeleted: false, deletedAt: null }).lean()

    if (!bookById) {
      return res.status(404).send({ status: false, message: "no book found by this ID" })
    }

    const Reviews = await reviewModel.find()

    bookById.reviewData = Reviews

    res.status(200).send({ status: true, message: "Book details", data: bookById })


  }
  catch (err) {
    res.status(500).send({ error: err.message })
  }
}




//4️⃣ DELETE BOOK BY ID ........

let deleteById = async function (req, res) {

  try {

    const bookId = req.params.bookId

    if (!bookId) {
      return res.status(400).send({ status: false, message: "bookId is required in path params" })
    }

    if (!isValid(bookId)) {
      return res.status(400).send({ status: false, message: `enter a valid bookId` })
    }

    const bookById = await booksModel.findOne({ _id: bookId, isDeleted: false, deletedAt: null })

    if (!bookById) {
      return res.status(404).send({ status: false, message: "no book found by this ID" })
    }

    const deleteBooks = await booksModel.findByIdAndUpdate(bookId, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })

    res.status(200).send({ status: true, message: "book deleted successfully" })


  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}




//5️⃣UPDATE BOOK

const updateBook = async function (req, res) {
  try {
    const bookId = req.params.bookId
    const dataForUpdation = req.body

    if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
      return res.status(400).send({ status: false, message: 'please provide valid bookId' })
    }

    const book = await booksModel.findOne({ _id: bookId, isDeleted: false })

    if (!book) {
      return res.status(404).send({ status: false, message: "No data found" })
    }

    if (!isValidRequestBody(dataForUpdation)) {
      return res.status(400).send({ status: false, message: 'please provide data for updation' })
    }

    const { title, excerpt, ISBN, releasedAt } = dataForUpdation

    if (!isValid(title)) {
      return res.status(400).send({ status: false, message: 'please provide title' })

    }

    const duplicateTitle = await booksModel.findOne({ title: title })
    if (duplicateTitle) {
      return res.status(400).send({ status: false, message: "This title already in use ,please provide another one" })
    }

    if (!isValid(excerpt)) {
      return res.status(400).send({ status: false, message: 'please provide excerpt' })
    }

    if (!isValid(ISBN)) {
      return res.status(400).send({ status: false, message: 'please provide ISBN' })
    }

    if (!(/^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(ISBN))) {
      return res.status(400).send({ status: false, message: 'please provide valid ISBN' })
    }

    const duplicateISBN = await booksModel.findOne({ ISBN: ISBN })
    if (duplicateISBN) {
      return res.status(400).send({ status: false, message: "This ISBN already in use ,please provide another one" })
    }

    if (!isValid(releasedAt)) {
      return res.status(400).send({ status: false, message: 'please provide releasedAt' })
    }

    if (!(/^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(releasedAt))) {
      return res.status(400).send({ status: false, message: 'please provide valid date in format (YYYY-MM-DD)' })
    }

    const updateData = { title, excerpt, ISBN, releasedAt }

    const updatedBook = await booksModel.findOneAndUpdate({ _id: bookId }, { ...updateData }, { new: true })

    return res.status(200).send({ status: true, message: "Book updated successfully", data: updatedBook })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}



module.exports.createBook = createBook
module.exports.getbook = getbook;
module.exports.updateBook = updateBook;
module.exports.deleteById = deleteById;
module.exports.getbookdetailsById = getbookdetailsById
















