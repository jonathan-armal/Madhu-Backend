const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const { 
  createServiceRequest, 
  getServiceRequests, 
  getUserServiceRequests 
} = require("../controllers/serviceRequestController");

// Multer Storage for Images
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

// Protected Routes (Requires Authentication)
router.post("/", protect, upload.single("image"), createServiceRequest);
router.get("/my-requests", protect, getUserServiceRequests); 

// Public Route (No Authentication Required)
router.get("/", getServiceRequests);  // Removed `protect`

module.exports = router;
