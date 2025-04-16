const mongoose = require("mongoose");

const SalesBannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

}, { timestamps: true });

const SalesBanner = mongoose.model("SalesBanner", SalesBannerSchema);

module.exports = SalesBanner;