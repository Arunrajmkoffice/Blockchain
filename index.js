// const express = require('express');
// const cors = require('cors');
// const app = express();
// const {connection} = require('./config/db');
// const signinRoutes = require('./routes/signin.routes');
// const signupRoutes = require('./routes/signup.routes');

// const productDetails = require('./routes/productDetails.routes');

// require("dotenv").config()

// const PORT = process.env.PORT||9090
// app.use(cors());
// app.use(express.json());

// app.use("/signup", signupRoutes);
// app.use("/signin", signinRoutes);
// app.use("/product", productDetails);


// app.listen(PORT,async()=>{
// console.log("Listining to port 9090")

// try{
//     await connection
//     console.log("Connected to db successfully")
// }
// catch(error){
//     console.log("error connecting to db",error)
// }
// })

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { connection } = require('./config/db');
const signinRoutes = require('./routes/signin.routes');
const signupRoutes = require('./routes/signup.routes');
const productDetails = require('./routes/productDetails.routes');
const tracking = require('./routes/tracking.routes');
const { productDetailsModel } = require('./module/productDetails.model');

require('dotenv').config();

// Create an instance of Express app
const app = express();
app.use(cors());
app.use(express.json());

// Set up Socket.IO
const server = http.createServer(app);
 const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST","PATCH"]
    }
  });





// Routes for signup and signin
app.use('/signup', signupRoutes);
app.use('/signin', signinRoutes);

// Route for product details
app.use('/product', productDetails);
// app.use('/tracking', tracking);




io.on('connection', async (socket) => {
    console.log('A client connected');
  try {
    // Fetch products data from the database
    const products = await productDetailsModel.find();
    
    // Emit the products data to the connected client
    io.emit('trackingUpdateBroadcast', products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
  // Example: Listen for a "trackingUpdated" event from the frontend
  // socket.on('trackingUpdated', (data) => {
  //   // Process the tracking update data received from the client
  //   console.log('Received tracking update:', data);
  //   // Broadcast the update to all connected clients

  //   io.emit('trackingUpdateBroadcast',data);
  // });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});





// Start the server
const PORT = process.env.PORT || 9090;
server.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);

  try {
    await connection;
    console.log('Connected to database successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
});


module.exports = io;