const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
    firstName: { type: String, },
    lastName: { type: String, },
    address: { type: String, required: true },
    city: { type: String,  },
    phoneNumber: { type: String, required: true },
    brand: { type: String,  required: true},
    model: { type: String, required: true },
  image: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
