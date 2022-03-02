const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    name: String,
    author_id : {
        type:Number,
        required: true
    },
    price : Number,
    rating : Number
},
{timestamps:true})

module.exports = mongoose.model('BookDetail',bookSchema)



   // // " best boook on earth"   [ "Nodejs in detail" , "mongodb in detail", "fronend in detail"] 
    // // {
    //     // "ch1 ": "awesome intro to JS",
    //     // "ch2" : "intro to nodejs",
    //     // "ch3" : "intro to db"
    // //  }
    // summary :  mongoose.Schema.Types.Mixed,
    // isDeleted: Boolean //true on book deletion i.e you flag the document/data as isDeleted: true..(mark "dirty")