const mongoose = require('mongoose')
const urlSchema = new mongoose({

    urlCode: {
        type: String,
        require: true,
        lowercase: true,
        trim: true
    },
    longUrl: {
        type: String,
        require: true
        //valid url
    },
    shortUrl: {
        type: String,
        unique: true
    },

})

module.exports = mongoose.model("Url", urlSchema)

