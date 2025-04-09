require("dotenv").config();
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");

// Import Routes
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/BrandRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const salesRoutes = require("./routes/SalesRoutes");
const reviewRoutes = require("./routes/ReviewRoutes");
const orderRoutes = require("./routes/orderRoutes"); // ✅ Order routes with invoice support
const authRoutes = require("./routes/authRoutes");
const footerRoutes = require("./routes/footerRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes"); // ✅ Added Wishlist Routes

const app = express();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
});
app.use(limiter);

// Security Headers
app.use(helmet());

// ✅ Allow All CORS
app.use(cors());

// Increase Payload Size Limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve Static Files with CORS headers
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  }
}));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes); // ✅ Invoice route added
app.use("/api/auth", authRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/wishlist", wishlistRoutes); // ✅ Integrated Wishlist Routes

// Default Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 Welcome to the Sewing Machine E-Commerce API!",
    endpoints: {
      products: "/api/products",
      categories: "/api/categories",
      brands: "/api/brands",
      banner: "/api/banner",
      serviceRequests: "/api/service-requests",
      sales: "/api/sales",
      reviews: "/api/reviews",
      orders: {
        allOrders: "/api/orders",
        getOrderById: "/api/orders/:orderId",
        downloadInvoice: "/api/orders/:orderId/invoice", 
      },
      wishlist: {
        add: "/api/wishlist/add",
        remove: "/api/wishlist/remove",
        getWishlist: "/api/wishlist/",
      },
      auth: {
        register: "/api/auth/register",
        login: "/api/auth/login",
      },
    },
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;