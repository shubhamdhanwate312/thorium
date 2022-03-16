const BlogModel= require("../models/blogModel")
const AutherModel=require("../models/autherModel")
let jwt=require('jsonwebtoken')

const createblog= async function (req, res) {
  try{  let data= req.body
    let savedData= await BlogModel.create(data)
    console.log(req.newAtribute)
    res.status(200).send({msg: savedData})
}

catch(err){
    res.status(500).send({statue:false , msg:err.message})
}


}

const loginAuther = async function (req, res) {
    try{
     let autherName = req.body.emailId;
     let password = req.body.password;
   
     
     let auther = await AutherModel.findOne({ emailId: autherName, password: password });
     if (!auther)
       return res.status(400).send({
         status: false,
         msg: "auther name or the password is not corerct",
       });
     let token = jwt.sign(
       { autherID: auther._id.toString() }, 'shubham-thorium'
     );
     res.setHeader("x-api-key", token);
     res.send({ status: true, data: token });
   } 
   catch (err) {
     console.log("This is the error :", err.message)
     res.status(500).send({ msg: "Error", error: err.message })
   }
   }





let getBlog = async function (req, res) {
    try{
        let query = req.query
        let filter ={
            isdeleted : false,
            ispublished : false,
            ...query
        };
        let filterByquery = await BlogModel.find(filter)
        if(filterByquery.length == 0){
            return res.status(400).send({msg:"Blog Not Found"})
        }
        else{
            return res.status(200).send({msg:filterByquery})
        }
    }catch(err){
        res.status(500).send({statue:false , msg:err.message})
    }

    
}




const updateblog = async function (req, res) {
  try {
    let updateblog = req.params.blogID
    let updateAuth= await BlogModel.findById(updateblog)


    if(req.user != updateAuth.autherID){
      return res.status(401).send({ msg: "You are not authorised" })
    }
    console.log(updateAuth)
    if (!updateAuth) {
      return res.status(404).send({ msg: "Invalid Blog" })
    }
    let updatedata = req.body;
    let updatedUser = await BlogModel.findOneAndUpdate({ _id: updateblog }, { title: updatedata.title, body: updatedata.body, tags: updatedata.tags, subcategory: updatedata.subcategory, ispublished: true }, { new: true, upsert: true });
    return res.status(200).send({ status: true, data: updatedUser })
  } catch (err) {
    return res.status(500).send({ Error: err.message })
  }

}


const deletebyId = async function (req, res) {
  try {
    let blogId = req.params.blogID
    const validId = await BlogModel.findById(blogId)

    if(req.user != validId.autherID ){
      return res.status(401).send({status: false, msg: "You are not authoorised"})
    }
    console.log(validId)
    if (!validId) {
      return res.status(404).send({ msg: "blog ID is Invalid" })
    }

    const deleteData = await BlogModel.findOneAndUpdate({ _id: blogId }, { isdeleted: true }, { new: true });
    console.log(deleteData)
    return res.status(200).send({ status: true, data: deleteData })

  } catch (err) {
    return res.status(500).send({ Error: err.message })
  }
}

const deletebyQuery = async function (req, res) {
  try {
    let input = req.query

    if(req.user != input.autherID){
      return res.status(401).send({status:false, msg: "you are not authorised"})
    }
    console.log(input)
    if (Object.keys(input).length == 0)
      return res.status(400).send({ status: false, msg: "please provide input data" })

    let deletedBlog = await BlogModel.updateMany({ $and: [input, { isdeleted: false }] }, { $set: { isdeleted: true, deletedAt: Date.now() } }, { new: true })

    return res.status(200).send({ data: deletedBlog })

  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
}


module.exports.createblog= createblog
module.exports.loginAuther=loginAuther
module.exports.getBlog= getBlog
module.exports.updateblog= updateblog
module.exports.deletebyId= deletebyId
module.exports.deletebyQuery=deletebyQuery
