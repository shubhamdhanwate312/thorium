let jwt=require('jsonwebtoken')
let authenticate = function (req, res, next) {
    //check the token in request header
    //validate this token
try{
    let xAuthToken = req.headers["x-auth-token"]
    if (xAuthToken != undefined) {

        console.log("done")
        next()
    }
    else {
        res.send("request is missing a mandatory header")
  }
  }
catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }
}

let authorise = function (req, res, next) {
    // comapre the logged in user's id and the id in request
    try{
    let token = req.headers["x-auth-token"]
    if (!token) return res.send({ status: false, msg: "token must be present in the request header" })
    let decodedToken = jwt.verify(token, 'shubham-thorium')

    if (!decodedToken) return res.send({ status: false, msg: "token is not valid" })
    let userToBeModified = req.params.userId
    let userLoggedIn = decodedToken.userId
    if (userToBeModified != userLoggedIn) { 
         res.status(403).send("User logged is not allowed to modify the requested users data")
    }
        console.log("done")
        next()
}

catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }
}
      
    


module.exports.authenticate = authenticate;
module.exports.authorise = authorise;