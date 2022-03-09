let jwt=require('jsonwebtoken')
let authenticate = function (req, res, next) {
    //check the token in request header
    //validate this token

    let xAuthToken = req.headers["x-auth-token"]
    if (xAuthToken != undefined) {

        console.log("done")
        next()
    }
    else {
        res.send("request is missing a mandatory header")
    }
}


let authorise = function (req, res, next) {
    // comapre the logged in user's id and the id in request
    let token = req.headers["x-auth-token"]
    if (!token) return res.send({ status: false, msg: "token must be present in the request header" })
    let decodedToken = jwt.verify(token, 'shubham-thorium')

    if (!decodedToken) return res.send({ status: false, msg: "token is not valid" })
    let userToBeModified = req.params.userId
    let userLoggedIn = decodedToken.userId
    if (userToBeModified != userLoggedIn) { 
         res.send("User logged is not allowed to modify the requested users data")
    }
        console.log("done")
        next()
}

      
    


module.exports.authenticate = authenticate;
module.exports.authorise = authorise;