const mongoose = require('mongoose');
const version = require('nodemon/lib/version');

const urlSchema = new mongoose.Schema({
    
    urlCode: {
        type: String,
        lowercase: true,
        trim: true,
       
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

