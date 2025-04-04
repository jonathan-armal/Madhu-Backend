const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET all products
router.get("/", productController.getAllProducts);

// POST a new product
router.post("/", productController.addProduct);

// PUT update a product
router.put("/:id", productController.updateProduct);

// DELETE a product
router.delete("/:id", productController.deleteProduct);     
router.get("/getproductbyid/:id", productController.getProductByid);    
// Backend: productRoutes.js
router.get("/trending", productController.getTrandingProduct);

module.exports = router;