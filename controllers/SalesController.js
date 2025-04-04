const SalesBanner = require("../models/Sales");
const fs = require("fs");
const path = require("path");

// 📌 Add a New Banner (Only One)
const addSalesBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Delete existing banner if one exists
        await SalesBanner.deleteMany({});

        const newBanner = new SalesBanner({
            image: req.file.filename
        });

        await newBanner.save();
        res.json({ message: "Sales banner added successfully!", newBanner });
    } catch (error) {
        res.status(500).json({ message: "Failed to add banner", error });
    }
};

// 📌 Delete Banner
const deleteSalesBanner = async (req, res) => {
    try {
        const banner = await SalesBanner.findOne();
        if (!banner) {
            return res.status(404).json({ message: "No banner found" });
        }

        // Delete image file from server
        const imagePath = path.join(__dirname, "../uploads", banner.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Delete from database
        await SalesBanner.deleteOne({});
        res.json({ message: "Banner deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete banner", error });
    }
};

// 📌 Get Current Banner
const getSalesBanner = async (req, res) => {
    try {
        const banner = await SalesBanner.findOne();
        if (!banner) {
            return res.status(404).json({ message: "No banner found" });
        }
        res.json(banner);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch banner", error });
    }
};

module.exports = { addSalesBanner, deleteSalesBanner, getSalesBanner };
