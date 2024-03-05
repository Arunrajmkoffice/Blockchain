const { Router } = require("express");
const { productDetailsModel } = require("../module/productDetails.model");
const authenticateToken = require("../middleware/authenticateToken");
const router = Router();

router.use(authenticateToken);

router.post("/", async (req, res) => {
  const { product, price, tracking } = req.body;

 


 
  if (!product || !price || !tracking) {
    return res.status(400).json({
      success: false,
      message: "All fields (product, price, tracking) are mandatory",
    });
  }

  try {
    const existingProduct = await productDetailsModel.findOne({ product });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product already exists",
      });
    }


    const newProduct = new productDetailsModel({
      product: product,
      price: price,
      tracking: tracking 
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await productDetailsModel.find();
    res.json({
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await productDetailsModel.findByIdAndDelete(productId);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    } else {
      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await productDetailsModel.findById(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    } else {
      res.json({
        product,
      });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});



router.patch("/:id", async (req, res) => {
  const productId = req.params.id;
  const { role } = req.body;

  try {
    const product = await productDetailsModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const matchingTrack = product.tracking.find(track => track.productAt === role);

    if (!matchingTrack) {
      return res.status(404).json({
        success: false,
        message: "No matching tracking entry found",
      });
    }

    if(matchingTrack.complete){
      return res.status(404).json({
        success: false,
        message: "Already updated",
      });
    }
    if(!matchingTrack.complete){
    const currentDate = new Date().toISOString().slice(0, 10); 
    const currentTime = new Date().toLocaleTimeString(); 
    matchingTrack.complete = true;
    matchingTrack.date = currentDate;
    matchingTrack.time = currentTime;
    }
  
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});


module.exports = router;