const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");




const isValid = function(value){

if(typeof value ==undefined ||  value ==null)
return false
if(typeof value==='string'&&value.trim().length===0) return false
return true

}

const createAuthor = async function (req, res) {

  try {

    let data = req.body;
    
    //console.log(data.fname)

    if (Object.keys(data).length>0) {
      if(!isValid(data.fname)){return res.status(400).send({status:false , msg:"First name is required"})}
      if(!isValid(data.lname)){return res.status(400).send({status:false , msg:"Last name is required"})}
     if (! (/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email) ))
     {return res.status(400).send({status:false,msg:"Please provide a valid email"})}
     if(! (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(data.password)) )
     {return res.status(400).send({status:false , msg:"please provide a valid password with one uppercase letter ,one lowercase, one character and one number "})}
     let dupli = await authorModel.findOne({email: data.email}) 
     
     if(dupli) {return res.status(400).send({status:false , msg:"Email already exists"})}
     
      let savedData = await authorModel.create(data);
      return res.status(201).send({ AuthorDetails: savedData });

    }

    else {return res.status(400).send({ERROR:"BAD REQUEST"}) }

  }catch (err){

    return res.status(500).send({ ERROR: err.message })

  }}

//Phase2
const loginAuthor = async function (req, res) {

  try {

    let body = req.body

    if (Object.keys(body)!=0) {
      let authName = req.body.email;
      let passwords = req.body.password;
      if (! (/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(authName) ))
      {return res.status(400).send({status:false,msg:"Please provide a valid email"})}
     if(! (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(passwords)) )
     {return res.status(400).send({status:false , msg:"please provide valid password with one uppercase letter ,one lowercase, one character and one number "})}
      


      let author = await authorModel.findOne({ email: authName, password: passwords });

      if (!author) {

        return res.status(400).send({
          status: false,
          ERROR: "username or the password is not corerct",
        });
      }

      let token = jwt.sign(
        {
          authId: author._id,
          
        }, "Project-One", { expiresIn: "1h" }

      );
      res.status(200).setHeader("x-api-key", token);
      return res.status(201).send({ status: "LoggedIn", TOKEN: token });
    }

    else {return res.status(400).send({ERROR:"Bad Request"}) }

  }
  catch (err) {
    
    return res.status(500).send({ ERROR: err.message }) }

};


module.exports.loginAuthor = loginAuthor

module.exports.createAuthor = createAuthor
