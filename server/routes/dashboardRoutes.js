const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {

    getDashboardStats,
    getMonthlySales,
    getRecentOrders,
    getBestSellingProducts,
    getTopCustomers,
    getInventoryReport

} = require("../controllers/dashboardController");

router.get("/stats", protect, admin, getDashboardStats);

router.get("/monthly-sales", protect, admin, getMonthlySales);

router.get("/recent-orders", protect, admin, getRecentOrders);

router.get("/best-products", protect, admin, getBestSellingProducts);

router.get("/top-customers", protect, admin, getTopCustomers);

router.get("/inventory", protect, admin, getInventoryReport);

module.exports = router;