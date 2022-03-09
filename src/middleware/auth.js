let authenticate=function(req,res,next){
      //check the token in request header
    //validate this token

    let xAuthToken = req.headers["x-auth-token"]
    if( xAuthToken != undefined){
        console.log("done")
        next()
    }
    else{
        res.send("request is missing a mandatory header")
    }
}


let authorise=function(req,res,next){
     // comapre the logged in user's id and the id in request
     let userToBeModified = req.params.userId
      if(userToBeModified != userLoggedIn) {
        console.log("done")
        next()
    }
    else{
        res.send("User logged is not allowed to modify the requested users data")
    }
}

module.exports.authenticate = authenticate;
module.exports.authorise= authorise;