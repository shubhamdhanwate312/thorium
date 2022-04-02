const jwt = require('jsonwebtoken');
const booksModel = require("../models/bookModel");


//Authentication ✅
const authentication = (req, res, next) => {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, message: "token must be present" });
        let decodedToken = jwt.verify(token, "mySecretK#key...$$@@");
        if (!decodedToken) return res.status(401).send("token invalid")
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


// Authorisation ✅
const authorisation = async function (req, res, next) {
    const token = req.headers['x-api-key']

    const verifyToken = jwt.verify(token, "mySecretK#key...$$@@")

    const userIdByToken = verifyToken.userId
    const id = req.params.bookId
    let Doc = await booksModel.findById(id)

    const DocId = Doc.userId
    if (!DocId) {
        return res.status(400).send({ status: false, message: 'invalid id' })
    }

    if (DocId != userIdByToken) {
        return res.status(403).send({ status: false, message: 'not a valid user' })
    }
    next()
}


module.exports.authentication = authentication;
module.exports.authorisation = authorisation;
