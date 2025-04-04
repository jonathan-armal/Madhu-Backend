const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: String, required: true },
  images: { type: [String], required: true }, // Array of image URLs or Base64 strings
  brand: { type: String, required: true },
  features: { type: [String], required: true }, // Array of features
  description: { type: String, required: true },
  specification: {
    machineType: { type: String, required: false },
    numberOfStitches: { type: String, required: false },
    maxStitchWidth: { type: String, required: false },
    maxStitchLength: { type: String, required: false },
    needleThreadingSystem: { type: String, required: false },
    bobbinSystem: { type: String, required: false },
    motorSpeed: { type: String, required: false },
    presserFoot: { type: String, required: false },
    freeArm: { type: String, required: false },
    light: { type: String, required: false },
    weight: { type: String, required: false },
    warranty: { type: String, required: false },
  },
  isTrending: { type: Boolean, default: false },
  isTopDiscounted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Product", productSchema);