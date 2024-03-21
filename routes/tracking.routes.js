const { Router } = require("express");
const { productDetailsModel } = require("../module/productDetails.model");
const authenticateToken = require("../middleware/authenticateToken");
const router = Router();

router.use(authenticateToken);

router.get("/", async (req, res) => {
  try {
    let query = {};

    // Pagination
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Sort
    const { sortBy, sortOrder } = req.query;
    let sortOption = {};
    if (sortBy && sortOrder) {
      sortOption[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Search
    const { search } = req.query;
    if (search) {
      const searchFields = ['brand', 'branchNumber', 'category', 'product', 'countryOfOrigin'];
      const searchConditions = searchFields.map(field => ({ [field]: { $regex: search, $options: 'i' } }));
      query.$or = searchConditions;
    }

    // Filter
    const { brand, category, countryOfOrigin } = req.query;
    if (brand) query.brand = brand;
    if (category) query.category = category;
    if (countryOfOrigin) query.countryOfOrigin = countryOfOrigin;

    // Get total count of documents for pagination
    const totalCount = await productDetailsModel.countDocuments(query);

    // Sorting directly in the MongoDB query and applying pagination
    let products = await productDetailsModel.find(query).sort(sortOption).skip(skip).limit(parseInt(limit));

    res.json({ products, totalCount });
  } catch (error) {
    console.error("Error fetching products:", error);
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

    const matchingTrack = product.tracking.find(
      (track) => track.productAt === role
    );

    if (!matchingTrack) {
      return res.status(404).json({
        success: false,
        message: "No matching tracking entry found",
      });
    }

    if (matchingTrack.complete) {
      return res.status(404).json({
        success: false,
        message: "Already updated",
      });
    }
    if (!matchingTrack.complete) {
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
