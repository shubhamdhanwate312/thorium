const { count } = require("console")
const authorModel = require('../models/authorModel')
const bookModel = require('../models/bookModel')

const createNewAuthor = async function (req,res) {
    const reqAuthor = req.body;
    const SavedData = await authorModel.create(reqAuthor)
    res.send( {msg : SavedData})
    
}

const createNewBook = async function (req,res) {
    const reqBook = req.body;
    const Saved = await bookModel.create(reqBook)
    res.send( {msg : Saved})
    
}

const allBooks = async function(req, res) {
    const authorDetails = await authorModel.find({author_name: "Chetan Bhagat"})
    const id = authorDetails[0].author_id
    const booksName = await bookModel.find({author_id: id}).select({name:1})
    res.send( {msg:booksName})
}

const updatedBookPrice = async function (req, res) {
    const bookDetails = await bookModel.find({name:"Two states"})
    const id = bookDetails[0].author_id
    const authorN = await authorModel.find({author_id:id}).select({author_name:1, _id:0})

    const bkName = bookDetails[0].name
    const updatedPrice = await bookModel.findOneAndUpdate({name:bkName}, {price:100},{new:true}).select({price:1, _id:0})

    res.send({msg:authorN, updatedPrice})

}

const authorsName = async function (req,res) {
    const booksId= await bookModel.find({price: {$gte:50, $lte:100}}).select({author_id:1, _id:0})
    const id = booksId.map(inp => inp.author_id)
   
    let temp =[]
    for(let i=0; i<id.length; i++) {
        let x = id[i]
        const author = await authorModel.find({author_id:x}).select({author_name:1, _id:0})
        temp.push(author)
    }

   const authorName = temp.flat()

  res.send({msg:authorName})
}

module.exports.createNewAuthor = createNewAuthor
module.exports.createNewBook = createNewBook
module.exports.allBooks = allBooks
module.exports.updatedBookPrice = updatedBookPrice
module.exports.authorsName = authorsName









// const createBook= async function (req, res) {
//     let data= req.body

//     let savedData= await BookModel.create(data)
//     res.send({msg: savedData})
// }

// const getBooksData= async function (req, res) {
//     let allBooks= await BookModel.find( {authorName : "HO" } )
//     console.log(allBooks)
//     if (allBooks.length > 0 )  res.send({msg: allBooks, condition: true})
//     else res.send({msg: "No books found" , condition: false})
// }


// const updateBooks= async function (req, res) {
//     let data = req.body // {sales: "1200"}
//     // let allBooks= await BookModel.updateMany( 
//     //     { author: "SK"} , //condition
//     //     { $set: data } //update in data
//     //  )
//     let allBooks= await BookModel.findOneAndUpdate( 
//         { authorName: "ABC"} , //condition
//         { $set: data }, //update in data
//         { new: true , upsert: true} ,// new: true - will give you back the updated document // Upsert: it finds and updates the document but if the doc is not found(i.e it does not exist) then it creates a new document i.e UPdate Or inSERT  
//      )
     
//      res.send( { msg: allBooks})
// }

// const deleteBooks= async function (req, res) {
//     // let data = req.body 
//     let allBooks= await BookModel.updateMany( 
//         { authorName: "FI"} , //condition
//         { $set: {isDeleted: true} }, //update in data
//         { new: true } ,
//      )
     
//      res.send( { msg: allBooks})
// }




// CRUD OPERATIONS:
// CREATE
// READ
// UPDATE
// DELETE



// module.exports.createBook= createBook
// module.exports.getBooksData= getBooksData
// module.exports.updateBooks= updateBooks
// module.exports.deleteBooks= deleteBooks
