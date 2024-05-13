const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({
    filename: {type:String,require:true},
    originalname: {type:String,require:true},
    mimetype: {type:String,require:true},
    size: {type:Number,require:true},
    path: {type:String,require:true},
  });
  
  const imageModel = mongoose.model('image', imageSchema);
  module.exports = {imageModel}