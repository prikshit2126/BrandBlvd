const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const couponRoutes = require("./routes/couponRoutes");
const addressRoutes = require("./routes/addressRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const protect = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorMiddleware");
const { swaggerUi, specs } = require("./swagger/swagger");

connectDB();

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(compression());

app.use(morgan("dev"));


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests. Please try again later."
});

app.use(limiter);
app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

// ================= Routes =================

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/brands", brandRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/coupons", couponRoutes);

app.use("/api/address", addressRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/users", userRoutes);

app.use("/api/subscribers", subscriberRoutes);

// Test Route

app.get("/", (req, res) => {

    res.send("🚀 BrandBlvd Backend Running");

});

// Protected Route

app.get("/api/profile", protect, (req, res) => {

    res.json({

        success: true,

        message: "Welcome to your profile!",

        user: req.user

    });

});

// 404

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "API Route Not Found"

    });

});

// Global Error Handler

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});