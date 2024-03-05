const mongoose = require('mongoose');


const trackingSchema = new mongoose.Schema({
     productAt: { type: String, required: false },
     date: { type: String, required: false },
     time: { type: String, required: false },
     complete: { type: Boolean, required: false },
 });


const productDetails = new mongoose.Schema({
     product:{type:String,require:true},
     price:{type:String,require:true},
     tracking:[trackingSchema]
     
});


const productDetailsModel = mongoose.model("productDetails", productDetails)
module.exports = {productDetailsModel}



let data = {
     product: "iphone",
     price: "10000",
     tracking: [
{productAt:"Us Warehouse", date:"3/3/2024", time:"10:00PM", trackId:"us1234", complete:true},
{productAt:"Medorna Office", date:"3/3/2024", time:"10:00PM", trackId:"us142433",complete:false},
{productAt:"IGO Office", date:"3/3/2024", time:"10:00PM", trackId:"us134223",complete:false},
{productAt:"Amazone", date:"3/3/2024", time:"10:00PM", trackId:"us122442345673",complete:false},
]
}