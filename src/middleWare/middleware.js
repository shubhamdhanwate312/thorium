// const { status } = require('express/lib/response');
// const jwt = require('jsonwebtoken');
// const booksModel = require('../models/booksModel')

// //Authentication ✅
// const authentication = async function (req, res, next) {
//     try {
//         let token = req.headers["x-api-key"]
//         if (!token) return res.status(401).send({ status: false, message: "token must be present" });
//         let decodedToken = jwt.verify(token, "Thorium");
//         if (!decodedToken) return res.status(401).send({ status: false, message: "token invalid" })
//     }
//     catch (err) {
//         res.status(500).send({ msg: "server error", err: err.message })
//     }
//     next()
// }


// //Authorisation ✅
// const authorisation = async function (req, res, next)  {
//     try {


//         let token = req.headers["x-api-key"];
//         let bookId = req.params.bookId;
//         let bookDetails = await booksModel.findById(bookId)
//         let userId = bookDetails.userId
//         if (!token)
//             return res.status(404).send({ status: false, message: "Token is not present" });

//         let decodedToken = jwt.verify(token, "Thorium");
//         if (!decodedToken)
//             return res.status(400).send({ status: false, message: "Invalid token" });

//         let decoded = decodedToken.userId
//         if (userId != decoded) return res.status(401).send({ status: false, msg: "anthentication denied" })

//         let modified = req.params.userId;
//         let loginUser = decodedToken.userId;

//         if (modified !== loginUser)
//             return res.status(403).send({ status: false, msg: "you are not authorised" });

//         // if (modified = loginUser) 
//         // return res.status(403).send({status: false,msg: "you are not authorised"});


//         next()
//     } catch (error) {
//         res.status(500).send({ status: false, error: error.message });
//     }
// };


// module.exports.authentication = authentication;
// module.exports.authorisation = authorisation;

const jwt = require("jsonwebtoken");



    let auth = async function(req,res,next){

        try{


            const data = req.body
            const userid = data.userId

        let token = req.headers["x-api-key"]
        if(token){
            let decodedToken = jwt.verify(token , "Thorium" )      
            if(decodedToken){

           req.decodedToken = decodedToken
                      
           }   { const id = decodedToken.userId
    
           if(userid != id) {
               return res.status(400).send({status : false, message : 'invalid user'})}
            next()
            
            }

        }else{ return res.status(400).send({ERROR:"Token Missing"})}   




    }catch(err){
        return res.status(500).send({ERROR:err.message})}
}
   
module.exports.auth=auth