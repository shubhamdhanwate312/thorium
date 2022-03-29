const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({ 

    title: {type:String, required:true, unique:true},

    excerpt: {type:String, required:true}, //summary

    userId: {type:ObjectId, required:true, ref:'User'},

    ISBN: {type:String, required:true, unique:true},//Note: For books without an ISBN, you can still 
    //provide those books in the feed. They might not be surfaced to users 
    //in Google Search. However, the following practices might help facilitate a correct match

    category: {type:String, required:true},

    subcategory: {type:String, required:true},

    reviews: {type:Number, default: 0, comment:{type:Number} },//Holds number of reviews of this book
    //review: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
    
    deletedAt: {type:Date}, 

    isDeleted: {type:Boolean, default: false},

    releasedAt: {type:Date, required:true},//*

  },{ timestamps: true });

  module.exports = mongoose.model('Book', bookSchema);