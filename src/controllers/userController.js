 const bookSchema= require("../models/userModel")

const createBooks= async function (req, res) {
    let data= req.body
    console.log(data)
    let savedData= await bookSchema.create(data)
    res.send({msg: savedData})
}

const getBooksList= async function (req, res) {
    let allbooks= await bookSchema.find()
    res.send({msg: allbooks})
}

module.exports.createBooks= createBooks
module.exports.getBooksList= getBooksList