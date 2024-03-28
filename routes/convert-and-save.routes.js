const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const { productDetailsModel } = require("../module/productDetails.model");
const { Readable } = require('stream');

router.post('/', async (req, res) => {
  try {
    const { csvData } = req.body;

    if (!csvData) {
      return res.status(400).json({ message: 'No CSV data provided.' });
    }

    // Decode base64-encoded CSV data
    const bufferData = Buffer.from(csvData, 'base64');
    const bufferStream = new Readable();
    bufferStream.push(bufferData);
    bufferStream.push(null);

    const data = [
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
        productAt: "Amazon Office",
        date: "",
        time: "",
        complete: false,
      },
    ];

    const products = [];

    bufferStream
      .pipe(csv())
      .on('data', (row) => {
        const product = {
          product: row.product,
          createdDate: new Date().toISOString().slice(0, 10),
          createdTime: new Date().toLocaleTimeString(),
          price: row.price,
          tracking: data,
          sku: row.sku,
          branchNumber: row.branchNumber,
          countryOfOrigin: row.countryOfOrigin,
          inventory: row.inventory,
          description: row.description,
          tag: row.tag,
          brand: row.brand,
          category: row.category,
          salesPrice: row.salesPrice,
          image: [{ imageData: "check", id: "one1" }],
          id: "modifiedProductName" // This should be replaced with a unique identifier
        };
        products.push(product);
      })
      .on('end', async () => {
        try {
          await productDetailsModel.insertMany(products);
          res.status(200).json({ message: 'CSV data uploaded successfully.', products });
        } catch (error) {
          console.error('Error inserting products:', error);
          res.status(500).json({ message: 'Error inserting products.' });
        }
      });
  } catch (error) {
    console.error('Error uploading CSV:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;