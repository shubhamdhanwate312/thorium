const { count } = require("console")
const authorModel = require("../models/authorModel")
const bookModel= require("../models/bookModel")
const publisherModel = require("../models/publisherModel")

const createBook= async function (req, res) {
    let book = req.body
    let authorId = book.author
    let publisherId = book.publisher

    //validation a
    if(!authorId) return res.send('The request is not valid as the author details are required.')

    //validation b
    let author = await authorModel.findById(authorId)
    if(!author) return res.send('The request is not valid as no author is present with the given author id')

    //validation c
    if(!publisherId) return res.send('The request is not valid as the publisher details are required.') 

    //validation d
    let publisher = await publisherModel.findById(publisherId)
    if(!publisher) return res.send('The request is not valid as no publisher is present with the given publisher id')

    let bookCreated = await bookModel.create(book)
    return res.send({data: bookCreated})
}

const getBooks= async function (req, res) {
    let books = await bookModel.find().populate('author publisher')
    res.send({data: books})
}

const updateBooks = async function (req, res) {
    // 5. a)
    let hardCoverPublishers = await publisherModel.find({
      name: { $in: ["Penguin", "HarperCollins"] },
    });
    let publisherIds = hardCoverPublishers.map((p) => p._id); //publisherIds is an array of publisher _id values
  
    await bookModel.updateMany(
      { publisher: { $in: publisherIds } },
      { isHardCover: true }
    );
  
    // 5. b)
    let highRatedAuthors = await authorModel.find({ rating: { $gt: 3.5 } });
    let authorIds = highRatedAuthors.map((a) => a._id);
  
    await bookModel.updateMany(
      { author: { $in: authorIds } },
      { $inc: { price: 10 } }
    );
  
    let updatedBooks = await bookModel.find();
    res.send({ updatedBookCollection: updatedBooks });
  };

module.exports.createBook= createBook;
module.exports.getBooks= getBooks;
module.exports.updateBooks = updateBooks;