const urlModel = require('../model/model')
const validUrl = require('valid-url')
// const isValid = function(value){
//     if(typeof value === 'undefined' || value === null ) return false
//     return true;
// }


const urlShortner=async function(req,res){
    try{
        const data = req.body.url;
        if(Object.keys(data).length===0){
            return res.status(400).send({status:false, message: "please provide data"})
        }
        if (validUrl.data()){
        } else {
            console.log('Not a URI');
        }
        
        


        const url = await urlModel.create(data)
        return res.status(201).send({ status: true, message: 'url created ', data: url })
    }
    catch(error){
        res.status(500).send({status:false, message:error.message})
    }
}


module.exports.urlShortner= urlShortner;


























