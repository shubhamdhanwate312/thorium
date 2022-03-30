const jwt = require('jsonwebtoken');
const booksModel = require("../models/bookModel");


//Authentication ✅
const authentication = (req, res, next) => {
    try {
        let token = req.headers["x-api-key"]
        console.log(token)
        if (!token) return res.status(401).send({status: false, msg:"token must be present"});
        let decodedToken = jwt.verify(token, "mySecretK#key...$$@@");
        if (!decodedToken) return res.status(401).send("token invalid")
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


// Create Authorisation ✅
const createAuthorisation = (req,res, next)=> {
    try{

        const data = req.body
        const userid = data.userId
    
        const token = req.headers['x-api-key']
        const decodeToken = jwt.verify(token,"mySecretK#key...$$@@")
        const id = decodeToken.userId
    
        if(userid != id) {
            return res.status(400).send({status : false, message : 'invalid user'})            
        }   
        next()
    }
    catch(err){
        res.status(500).send({ status: false, error: err.message });
    }
}


//Authorisation ✅
// const authorisation = (req, res, next) => {
//     try {
//         let bookId = req.params.bookId;
//         let token = req.headers["x-api-key"];
//         if (!token)
//             return res.status(404).send({ status: false, message: "Token is not present" });

//         let decodedToken = jwt.verify(token, "mySecretK#key...$$@@");
//         if (!decodedToken)
//             return res.status(400).send({ status: false, message: "Invalid token" });
//         let loginAuthor = decodedToken.authorid;

//         if (bookId != loginAuthor) return res.status(403).send({ status: false, msg: "you are not authorised" });

//         next();
//     } catch (error) {
//         res.status(500).send({ status: false, error: error.message });
//     }
// };

const authorisation = async function (req, res, next) {
    const token = req.headers['x-api-key']

    const verifyToken = jwt.verify(token, "mySecretK#key...$$@@")

    const userIdByToken = verifyToken.userId 
    const id = req.params.bookId
    let Doc = await booksModel.findById(id)
    console.log(Doc)

    const DocId = Doc.userId
    if(!DocId){
        return res.status(400).send({status : false, message : 'invalid id'})
    }
        
    if(DocId != userIdByToken) {
        return res.status(400).send({status : false, message : 'not a valid user'})
    }
    next()
}


// const authorisation = async function (req, res, next) {
//     try {
//         let token = req.headers["x-auth-token"];
//         if (!token) return res.status(401).send({status: false, msg:"token must be present"});
//         let decodedToken = jwt.verify(token, "Nasir-hussain");
//         const modifyUser = req.params.userId;
//         if (!modifyUser) {
//             res.status(400).send("BAD REQUEST")
//         }
//         let userLoggedIn = decodedToken.userId;
//         if (modifyUser !== userLoggedIn) return res.status(403).send("No such user exist")
//     }
//     catch (error) {

//     }
//     next()
// }

module.exports.authentication = authentication;
module.exports.authorisation = authorisation;
module.exports.createAuthorisation = createAuthorisation;
