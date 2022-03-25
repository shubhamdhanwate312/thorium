const userModel = require("../models/userModel")
const jwt= require("jsonwebtoken")


const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    if(typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}

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
        
        if(!(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(userBody.password))) {
            //Minimum eight characters, at least one letter, one number and one special character:
            return res.status(400).send({ status: false, message: 'Please provide a valid password'})
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



const loginUser = async function (req, res) {

    try {
  
      let body = req.body
  
      if (Object.keys(body)!=0) {
        let userName = req.body.email;
        let passwords = req.body.password;
        if (! (/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(userName) ))
  
        {return res.status(400).send({status:false,msg:"Please provide a valid email"})
      }

        if(!(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(passwords))) {
            return res.status(400).send({ status: false, message: 'Please provide a valid password'})
        }
        
  
  
        let user = await userModel.findOne({ email: userName, password: passwords });
  
        if (!user) {
  
          return res.status(400).send({
            status: false,
            ERROR: "username or the password is not corerct",
          });
        }
  
        let token = jwt.sign(
          {
            userId: user._id,
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + 10*60*60
            
          }, "Thorium"
  
        );
        res.status(200).setHeader("x-api-key", token);
        return res.status(201).send({ status: "LoggedIn",message: 'Success', TOKEN: token });
      }
  
      else {return res.status(400).send({ERROR:"Bad Request"}) }
  
    }
    catch (err) {
      
      return res.status(500).send({ ERROR: err.message })
   }
  
  };
  

  
module.exports.loginUser = loginUser
module.exports.createUser= createUser;


