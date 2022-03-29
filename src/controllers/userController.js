const userModel = require("../models/userModel")
const jwt= require("jsonwebtoken")


const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    if(typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}

const isValidTitle = function(title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}


const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}


//✅ CREATE USER
const createUser = async function (req, res) {
    try {
        const userBody = req.body;
        if(!isValidRequestBody(userBody)) {
            return res.status(400).send({status: false, message: 'Please provide user details'})
        }

        const {title, name, phone, email, password, address} = userBody;
        
        if(!isValid(title)) {
            return res.status(400).send({status: false, message: 'Title is required'})
        }
        
        if(!isValidTitle(title)) {
            return res.status(400).send({status: false, message: 'Title is not Valid'})
        }


        if(!isValid(name)) {
            return res.status(400).send({status: false, message: 'Name is required'})
        }

        if(!isValid(phone)) {
            return res.status(400).send({status: false, message: 'Phone number is required'})
        }
        
        if (!(/^([+]\d{2})?\d{10}$/.test(userBody.phone))) {
            return res.status(400).send({ status: false, msg: 'please provide a valid moblie Number' })
        }

        if(!isValid(email)) {
            return res.status(400).send({status: false, message: 'Email is required'})
        }
        
        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(userBody.email))) {
            return res.status(400).send({ status: false, msg: "Please provide a valid email" })
        }

        if(!isValid(password)) {
            return res.status(400).send({status: false, message: 'Password is required'})
        }
        // minumum 8 max 15 
        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,15}$/.test(userBody.password))) {

            return res.status(400).send({ status: false, message: ' Min 1 uppercase letter,Min 1 lowercase letter,Min 1 special character,Min 1 number,Min 8 characters,Max 15 characters' })
      
          }
      
        
        const duplicatePhone = await userModel.findOne({phone});
        if(duplicatePhone) {
            return res.status(400).send({status: false, message: `${phone} phone number is already registered`})
        }
        
        const duplicateEmail = await userModel.findOne({email});

        if(duplicateEmail) {
            return res.status(400).send({status: false, message: `${email} email address is already registered`})
        }

        const userData = {title, name, phone, email, password, address}
        const createdUser = await userModel.create(userData);

        return res.status(201).send({status: true, message: 'User successfully created', data: createdUser});
    
    } catch (error) {
        return res.status(500).send({status: false, message: error.message});
    }
}


//✅ LOGIN USER
const loginUser = async function (req, res) {
    try {
        let userName = req.body.email
        let password = req.body.password
        if (!(userName && password)) {
            res.status(400).send({ msg: "BAD REQUEST" })
        } else {
            let User = await userModel.findOne({ email: userName, password: password })
            if (!User)
                return res.status(403).send({ msg: "Cannot login as userName and password not matched" });
            let iat= Math.floor(Date.now() / 1000)
            let token = jwt.sign({ userId: User._id,exp: iat + (60)}, "Nasir-hussain")
            res.setHeader("x-auth-token", token);
            res.status(201).send({ msg: "your login is successfull", data: token })
        }
    }
    catch (error) {
        console.log("This is the error:", error.message)
        res.status(500).send({ msg: "server error", err: error })
    }

}


module.exports.loginUser = loginUser
module.exports.createUser= createUser;



