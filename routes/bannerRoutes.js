const express = require("express");
const multer = require("multer");
const { getBanner, postBanner, updateBanner, deleteBanner } = require("../controllers/bannerController");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Store images in 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

// 📌 Routes
router.get("/", getBanner);
router.post("/postbanner", upload.single("image"), postBanner);
router.put("/", upload.single("image"), updateBanner);
router.delete("/delete/:id", deleteBanner); // ✅ Added DELETE route

module.exports = router;
