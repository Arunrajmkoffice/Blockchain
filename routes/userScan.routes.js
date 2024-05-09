const { Router } = require("express");
const { productDetailsModel } = require("../module/productDetails.model");
const router = Router();

router.patch("/:id", async (req, res) => {
  
    const productId = req.params.id;

    try {
      const product = await productDetailsModel.findOne({ qr: { $elemMatch: { $eq: productId } } });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }
  
      const currentDate = new Date().toISOString().slice(0, 10);
      const currentTime = new Date().toLocaleTimeString();
  
      product?.tracking?.forEach((track) => {
        if(!track.complete){
          track.complete =    true;
          track.date = currentDate;
          track.time = currentTime;
        }     
    });
   
      await product.save();
  
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: product
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
});

module.exports = router;
