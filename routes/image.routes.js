const { Router } = require("express");
const { imageModel } = require("../module/image.model");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "dnbclknau", 
  api_key: "838397141496413", 
  api_secret: "REdRIEY6_448yQUSFupiN7aGcvY"
});

const router = Router(); // Create an instance of Router

router.post('/', async (req, res) => {
    try {
      // Extract image data from request body
      const imageData = req.body.imageData;
  
      // Extract base64 data part
      const base64Data = imageData.split(';base64,').pop();
  
      // Decode base64 data
      const decodedImage = Buffer.from(base64Data, 'base64');
  
      // Generate a unique filename
      const filename = `${uuidv4()}.jpg`;

      // Write the decoded image data to a temporary file
      const tempFilePath = `temp/${filename}`;
      fs.writeFileSync(tempFilePath, decodedImage);
  
      // Upload the temporary file to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(tempFilePath, {
        public_id: `uploads/${filename}`, // Optional: Specify folder and filename
        resource_type: 'image' // Specify the type of resource being uploaded
      });

      // Delete the temporary file
      fs.unlinkSync(tempFilePath);
  
      // Get the public URL of the uploaded image from Cloudinary
      const imageUrl = uploadedImage.secure_url;
  
      // Save the image document to MongoDB (if needed)
      const newImage = new imageModel({
        filename: uploadedImage.public_id, // You can save Cloudinary's public_id if needed
        originalname: filename,
        mimetype: 'image/jpeg',
        size: uploadedImage.bytes,
        path: imageUrl
      });
      await newImage.save();
  
      // Return the image URL
      res.json({ imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;
