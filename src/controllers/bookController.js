const booksModel = require("../models/bookModel")

const userModel=require('../models/userModel')
const reviewModel =require('../models/reviewModel')

const ObjectId = require("mongoose").Types.ObjectId

const isValid = function (value) {
    if (typeof value == undefined || value == null || value.length == 0) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}
const isValidRequestBody = function(requestBody) {
  return Object.keys(requestBody).length > 0
}



//1️⃣Create book ...............................................

const createBook = async function (req, res) {
    try {

        let data = req.body;
        let user = data.userId
        // const { title, category, subcategory, ISBN, excerpt, reviews, ReleasedAt } = data
        let userValid = await userModel.find({ _id: user })
        if (Object.keys(userValid).length === 0) {
            return res.status(400).send({ status: false, msg: "Enter a valid userID" })
          }

        if (Object.keys(data).length != 0) {
            if (!isValid(data.title)) { return res.status(400).send({ status: false, msg: "Title is required" }) }

            if (!isValid(data.excerpt)) { return res.status(400).send({ status: false, msg: "excerpt is required" }) }

            if (!isValid(data.userId)) { return res.status(400).send({ status: false, msg: "UserID is required" }) }

            if (!isValid(data.ISBN)) { return res.status(400).send({ status: false, msg: "ISBN is required/unique" }) }

            if (!isValid(data.category)) { return res.status(400).send({ status: false, msg: "Category is required " }) }

            if (!isValid(data.subcategory)) { return res.status(400).send({ status: false, msg: "subcategory is required " }) }

            if (!isValid(data.releasedAt)) { return res.status(400).send({ status: false, msg: "releasedAt is required " }) }

            if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(data.releasedAt)) {
                return res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\" this Date format & only number format is accepted ' })
            }
            let BookCreated = await booksModel.create(data);
          return res.status(201).send({ status: true, data: BookCreated })
        }
    }
    catch (err) {
        return res.status(500).send({ ERROR: err.message })
    }
}



//2️⃣ GET BOOKS ........

const getbook = async function (req, res) {
    try {
            const data = req.query
            const filter ={
              ...data,
              isDeleted : false
            } 
        const Books = await booksModel.find(filter).select({title:1,excerpt:1,userId:1,category:1,
            releasedAt:1,reviews:1}).sort({title:1})// arrange like alphabetical oreder
        
        if(Books.length === 0){
          return res.status(404).send({status:true, message:"no books found."})}
          
          res.status(200).send({status:true, message:"books list",data:Books}) 
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

  try{

 const bookId = req.params.bookId

     if(!bookId){
     return res.status(400).send({status : false, message : "bookId is required in path params"})
     }   

     if(!isValid(bookId)){
     return  res.status(400).send({status : false, message : `enter a valid bookId`})
     }

     const bookById = await booksModel.findOne({_id : bookId, isDeleted : false, deletedAt : null})

     if(!bookById){
     return res.status(404).send({status : false, message : "no book found by this ID"})
     }

     const deleteBooks = await booksModel.findByIdAndUpdate(bookId, {$set : {isDeleted : true, deletedAt : Date.now() }}, {new : true})

     res.status(200).send({status : true, message : "book deleted successfully"})


}catch(err){
 res.status(500).send({error : err.message})
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
module.exports.getbook= getbook;
module.exports.updateBook= updateBook;
module.exports.deleteById= deleteById;
module.exports.getbookdetailsById = getbookdetailsById
















