
// const reviewModel=require('../models/reviewModel')
// const ObjectId = require("mongoose").Types.ObjectId
// // validation........................................................
// const isValidRequestBody = (requestBody) => {

//     return Object.entries(requestBody).length > 0  //gives data in key-pair value
  
//   }
// const isValid = function (value) {
//     if (typeof value == undefined || value == null) return false
//     if (typeof value === 'string' && value.trim().length === 0) return false
//     return true
// }

// const creatReview= async function(req,res){
//     try{
//         const data=req.body
//         const bookId=req.params.bookId
//         if(!ObjectId(bookId)) return res.status(400).send({status:false,message:"please provide valid id"})

//         if(!isValidRequestBody){
//             return res.status(400).send({status:false, message:"please provide review data"})
//         }
//         const {review, rating, reviewedAt,reviewedBy}= data
//         if(!isValid(rating)) return res.status(400).send({status:false, message:"please provide review rating"})
      

//         if(!isValid(review)) return res.status(400).send({status:false, message:"please provide review "})
       
//         if(!isValid(reviewedBy)) return res.status(400).send({status:false, message:"please provide reviewrs name"})

//         if(!isValid(bookId)) return res.status(400).send({status:false, message:"please provide book id"})
            
//         //validating rating
      
//         if(rating<1) return res.status(400).send({status:false, message:"rating must be greater than 1"})
//         if(rating>5) return res.status(400).send({status:false, message:"rating must be less than 5"})

//         //validating reviewdAt
//         data.reviewedAt=Date.now();

//         const reviewDetails= await reviewModel.create(data)

//         const countReview= await reviewModel.findByIdAndUpdate({_id:bookId,isDeleted:false}, { $inc: { reviews: 1 } })
//         const details = {
//             _id: reviewDetails._id,
//             bookId: reviewDetails.bookId,
//             reviewedBy: reviewDetails.reviewedBy,         //this way to use create and some usefull data(we can say here we select who data we want)
//             reviewedAt: reviewDetails.reviewedAt,
//             rating: reviewDetails.rating,
//             review: reviewDetails.review

//         }
 
//         return res.status(201).send({ status: true, message: "success", data: details })

//     }
//     catch (err) {
//         console.log(err)
//         return res.status(500).send({ status: false, message: "error" })
//     }
// }


// module.exports.creatReview=creatReview