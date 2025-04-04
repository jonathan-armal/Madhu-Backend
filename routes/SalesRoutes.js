const express = require("express");
const router = express.Router();
const { addSalesBanner, deleteSalesBanner, getSalesBanner } = require("../controllers/SalesController");
const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });

// Routes
router.post("/add", upload.single("image"), addSalesBanner);

router.delete("/delete", deleteSalesBanner);
router.get("/", getSalesBanner);

module.exports = router;
