const jwt = require('jsonwebtoken');
const booksModel = require("../models/bookModel");


//Authentication ✅
const authentication = (req, res, next) => {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({status: false, message:"token must be present"});
        let decodedToken = jwt.verify(token, "TmySecretK#key...$$@@");
        if (!decodedToken) return res.status(401).send("token invalid")
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


// Create Authorisation ✅
const createAuthorisation = (req,res, next)=> {
    try{
        const data = req.body
        const userid = data.userId
    
        const token = req.headers['x-api-key']
        const decodeToken = jwt.verify(token,"TmySecretK#key...$$@@")
        const id = decodeToken.userId
    
        if(userid != id) {
            return res.status(403).send({status : false, message : 'invalid user'})            
        }   
        next()
    }
    catch(err){
        res.status(500).send({ status: false, error: err.message });
    }
}

// Create Authorisation ✅
const authorisation = async function (req, res, next) {
    const token = req.headers['x-api-key']

    const verifyToken = jwt.verify(token, "TmySecretK#key...$$@@")

    const userIdByToken = verifyToken.userId 
    const id = req.params.bookId
    let Doc = await booksModel.findById(id)
 

    const DocId = Doc.userId
    if(!DocId){
        return res.status(400).send({status : false, message : 'invalid id'})
    }
        
    if(DocId != userIdByToken) {
        return res.status(403).send({status : false, message : 'not a valid user'})
    }
    next()
}


module.exports.authentication = authentication;
module.exports.authorisation = authorisation;
module.exports.createAuthorisation = createAuthorisation;
