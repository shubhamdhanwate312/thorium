const mongoose = require('mongoose');


const urlSchema = new mongoose.Schema({
    
    urlCode: {
        type: String,
        lowercase: true,
        trim: true,
        unique:true
       
    },
    longUrl: {
        type: String,
        require: true
        //valid url
    },
    shortUrl: {
        type: String,
       unique:true
    },

});



module.exports = mongoose.model('Url', urlSchema)

