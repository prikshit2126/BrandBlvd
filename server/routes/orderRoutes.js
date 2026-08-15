const express = require("express");

const router = express.Router();


// =====================================================
// MIDDLEWARE
// =====================================================

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


// =====================================================
// CONTROLLER
// =====================================================

const {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
} = require("../controllers/orderController");


// =====================================================
// ADMIN ROUTES
// =====================================================

// Get all orders
router.get(
    "/admin/all",
    protect,
    admin,
    getAllOrders
);


// Update order delivery/status
router.put(
    "/admin/:id",
    protect,
    admin,
    updateOrderStatus
);


// Update UPI payment status
router.put(
    "/admin/:id/payment",
    protect,
    admin,
    updatePaymentStatus
);


// =====================================================
// CUSTOMER ROUTES
// =====================================================

// Place order
router.post(
    "/",
    protect,
    placeOrder
);


// Get customer's orders
router.get(
    "/",
    protect,
    getMyOrders
);


// Get single customer's order
router.get(
    "/:id",
    protect,
    getOrderById
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;