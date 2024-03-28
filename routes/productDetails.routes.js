const { Router } = require("express");
const { v4: uuidv4 } = require('uuid');
const { productDetailsModel } = require("../module/productDetails.model");
const authenticateToken = require("../middleware/authenticateToken");
const router = Router();

router.use(authenticateToken);

const crypto = require("crypto");

function generateImageName(imageData) {
  const hash = crypto.createHash("sha1").update(imageData).digest("hex");
  return hash.slice(0, 10); // Get the first 10 characters of the hash
}

// router.post("/", async (req, res) => {
//   const {
//     product,
//     price,
//     sku,
//     branchNumber,
//     countryOfOrigin,
//     inventory,
//     description,
//     tag,
//     brand,
//     category,
//     salesPrice,
//     image
//   } = req.body;

//   if (
//     !product ||
//     !price ||
//     !sku ||
//     !branchNumber ||
//     !countryOfOrigin ||
//     !inventory ||
//     !description ||
//     !tag ||
//     !brand ||
//     !category ||
//     !salesPrice ||
//     !image
//   ) {
//     return res.status(400).json({
//       success: false,
//       message: "All fields (product, price) are mandatory",
//     });
//   }

//   try {
//     // const existingProduct = await productDetailsModel.findOne({ product });

//     // if (existingProduct) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "Product already exists",
//     //   });
//     // }

//   let data =  [ {
//       "productAt": "Us Warehouse",
//       "date": new Date().toISOString().slice(0, 10),
//       "time": new Date().toLocaleTimeString(),
//       "complete": true
//     },
//     {
//       "productAt": "Medorna Office",
//       "date": "",
//       "time": "",
//       "complete": false

//     },
//     {
//       "productAt": "IGO Office",
//       "date": "",
//       "time": "",
//       "complete": false

//     },
//     {
//       "productAt": "Amazone Office",
//       "date": "",
//       "time": "",
//       "complete": false

//     }]

//     const newProduct = new productDetailsModel({
//       product: product,
//       createdDate:new Date().toISOString().slice(0, 10),
//       createdTime:new Date().toLocaleTimeString(),
//       price: price,
//       tracking: data,
//       sku: sku,
//       branchNumber: branchNumber,
//       countryOfOrigin: countryOfOrigin,
//       inventory: inventory,
//       description: description,
//       tag: tag,
//       brand: brand,
//       category: category,
//       salesPrice:salesPrice,
//       image:image
//     });

//     await newProduct.save();

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//     });
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });

//----------------------------------------------------------------------------------------
router.post("/", async (req, res) => {
  const {
    product,
    price,
    sku,
    branchNumber,
    countryOfOrigin,
    inventory,
    description,
    tag,
    brand,
    category,
    salesPrice,
    image,
  } = req.body;

  if (
    !product ||
    !price ||
    !sku ||
    !branchNumber ||
    !countryOfOrigin ||
    !inventory ||
    !description ||
    !tag ||
    !brand ||
    !category ||
    !salesPrice ||
    !image
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields (product, price) are mandatory",
    });
  }

  try {
    let data = [
      {
        productAt: "Us Warehouse",
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString(),
        complete: true,
      },
      {
        productAt: "Medorna Office",
        date: "",
        time: "",
        complete: false,
      },
      {
        productAt: "IGO Office",
        date: "",
        time: "",
        complete: false,
      },
      {
        productAt: "Amazone Office",
        date: "",
        time: "",
        complete: false,
      },
    ];




    const generateUniqueProductName = async (productName, count = 1) => {
      // Split the product name into name and count (if it already has a count)
      const nameParts = productName.split('-');
      const lastPart = nameParts[nameParts.length - 1];
      const existingCount = isNaN(parseInt(lastPart)) ? null : parseInt(lastPart);
    
      // If the product name already has a count, use that count
      // Otherwise, use the provided count (default is 1)
      const currentCount = existingCount !== null ? existingCount : count;
    
      // Get the name by removing the last part if it's a count
      const name = existingCount !== null ? nameParts.slice(0, -1).join('-') : productName;
    
      const existingProduct = await productDetailsModel.findOne({ product: productName }).sort({ createdDate: -1 });
    
      if (existingProduct) {
        // Increment the count and generate a new product name
        const newCount = currentCount + 1;
        const newProductName = `${name}-${newCount}`;
        // Recursively check again with the new product name
        return generateUniqueProductName(newProductName, newCount);
      } else {
        return productName;
      }
    };


    
    // Generate a unique product name
    const uniqueProduct = await generateUniqueProductName(product);
    const modifiedProductName = uniqueProduct.replace(/\s+/g, '-').toLowerCase();
   
console.log("modifiedProductName",modifiedProductName)

    const imageLinks = [];

    for (const img of image) {
      const imageType = img.imagedata.split(";")[0].split("/")[1];
      const imageLink = `${generateImageName(img.imagedata)}.${imageType}`;
      imageLinks.push({ imageData: img.imagedata, id: img.id });
    }

    const newProduct = new productDetailsModel({
      product: uniqueProduct,
      createdDate: new Date().toISOString().slice(0, 10),
      createdTime: new Date().toLocaleTimeString(),
      price: price,
      tracking: data,
      sku: sku,
      branchNumber: branchNumber,
      countryOfOrigin: countryOfOrigin,
      inventory: inventory,
      description: description,
      tag: tag,
      brand: brand,
      category: category,
      salesPrice: salesPrice,
      image: imageLinks,
      id:modifiedProductName
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
//----------------------------------------------------------------------------------------

// router.post("/", async (req, res) => {
//   const {
//     product,
//     price,
//     sku,
//     branchNumber,
//     countryOfOrigin,
//     inventory,
//     description,
//     tag,
//     brand,
//     category,
//     salesPrice,
//     image
//   } = req.body;

//   if (
//     !product ||
//     !price ||
//     !sku ||
//     !branchNumber ||
//     !countryOfOrigin ||
//     !inventory ||
//     !description ||
//     !tag ||
//     !brand ||
//     !category ||
//     !salesPrice ||
//     !image
//   ) {
//     return res.status(400).json({
//       success: false,
//       message: "All fields (product, price) are mandatory",
//     });
//   }

//   try {
//     let productName = product.trim();
//     let productCount = 1;

//     // Check if a product with the same name already exists
//     const existingProduct = await productDetailsModel.findOne({ product: productName });

//     if (existingProduct) {
//       // Extract the count from the product name (if it exists)
//       const match = productName.match(/-(\d+)$/);
//       if (match) {
//         // Update the count and remove it from the product name
//         productCount = parseInt(match[1]) + 1;
//         productName = productName.replace(/-\d+$/, '');
//       } else {
//         // If no count exists, find the highest count for the product
//         const similarProducts = await productDetailsModel.find({ product: { $regex: new RegExp('^' + productName + '-[0-9]*$', 'i') } });
//         if (similarProducts.length > 0) {
//           const counts = similarProducts.map(p => parseInt(p.product.split('-').pop()));
//           productCount = Math.max(...counts) + 1;
//         } else {
//           // If no similar products exist, append '-2' to the product name
//           productCount = 2;
//         }
//       }
//     }

//     // Append the count to the product name
//     productName += `-${productCount}`;

//     // Create the new product document
//     let data = [{
//         "productAt": "Us Warehouse",
//         "date": new Date().toISOString().slice(0, 10),
//         "time": new Date().toLocaleTimeString(),
//         "complete": true
//       },
//       {
//         "productAt": "Medorna Office",
//         "date": "",
//         "time": "",
//         "complete": false
//       },
//       {
//         "productAt": "IGO Office",
//         "date": "",
//         "time": "",
//         "complete": false
//       },
//       {
//         "productAt": "Amazone",
//         "date": "",
//         "time": "",
//         "complete": false
//       }
//     ];

//     const newProduct = new productDetailsModel({
//       product: productName,
//       createdDate: new Date().toISOString().slice(0, 10),
//       createdTime: new Date().toLocaleTimeString(),
//       price: price,
//       tracking: data,
//       sku: sku,
//       branchNumber: branchNumber,
//       countryOfOrigin: countryOfOrigin,
//       inventory: inventory,
//       description: description,
//       tag: tag,
//       brand: brand,
//       category: category,
//       salesPrice: salesPrice,
//       image: image
//     });

//     await newProduct.save();

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//     });
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });















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
      sortOption[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    // Search
    const { search } = req.query;
    if (search) {
      const searchFields = [
        "brand",
        "branchNumber",
        "category",
        "product",
        "countryOfOrigin",
      ];
      const searchConditions = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
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
    let products = await productDetailsModel
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ products, totalCount });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// router.get("/", async (req, res) => {
//   try {
//     let products = await productDetailsModel.find();

//     // Sorting
//     const { sortBy, sortOrder } = req.query;
//     if (sortBy && sortOrder) {
//       products = products.sort((a, b) => {
//         const sortValA = typeof a[sortBy] === 'string' ? a[sortBy].toLowerCase() : a[sortBy];
//         const sortValB = typeof b[sortBy] === 'string' ? b[sortBy].toLowerCase() : b[sortBy];
//         if (sortOrder === "asc") {
//           return sortValA > sortValB ? 1 : -1;
//         } else {
//           return sortValA < sortValB ? 1 : -1;
//         }
//       });
//     }

//     // Searching
//     const { search } = req.query;
//     if (search) {
//       const searchTerm = search.toLowerCase();
//       products = products.filter((item) =>
//         Object.values(item).some((value) =>
//           typeof value === 'string' && value.toLowerCase().includes(searchTerm)
//         )
//       );
//     }

//     // Filtering
//     const { brand, category, countryOfOrigin } = req.query;
//     if (brand) {
//       products = products.filter((item) => item.brand.toLowerCase() === brand.toLowerCase());
//     }
//     if (category) {
//       products = products.filter((item) => item.category.toLowerCase() === category.toLowerCase());
//     }
//     if (countryOfOrigin) {
//       products = products.filter((item) =>
//         item.countryOfOrigin.toLowerCase() === countryOfOrigin.toLowerCase()
//       );
//     }

//     res.json({
//       success: true,
//       products,
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });

router.delete("/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await productDetailsModel.findOneAndDelete({ product: productId });

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
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
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

router.patch("/edit/:id", async (req, res) => {
  const productId = req.params.id;
  const updatedProductDetails = req.body;

  if (Object.keys(updatedProductDetails).length === 0) {
    return res
      .status(400)
      .json({
        ststus: false,
        message: "At least one field is required to edit the data",
      });
  }

  try {
    const updatedProduct = await productDetailsModel.findByIdAndUpdate(
      productId,
      updatedProductDetails,
      { new: true }
    );
    res.json({ ststus: true, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
