const express = require('express');
const cors = require('cors');
const app = express();
const {connection} = require('./config/db');
const signinRoutes = require('./routes/signin.routes');
const signupRoutes = require('./routes/signup.routes');

const productDetails = require('./routes/productDetails.routes');

require("dotenv").config()

const PORT = process.env.PORT||9090
app.use(cors());
app.use(express.json());

app.use("/signup", signupRoutes);
app.use("/signin", signinRoutes);
app.use("/product", productDetails);


app.listen(PORT,async()=>{
console.log("Listining to port 9090")

try{
    await connection
    console.log("Connected to db successfully")
}
catch(error){
    console.log("error connecting to db",error)
}
})