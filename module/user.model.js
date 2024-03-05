const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email:{type:String,require:true},
    password:{type:String,require:true},
    role:{type:String,require:false}
})
const userModel = mongoose.model("userCridential", userSchema)
module.exports = {userModel}