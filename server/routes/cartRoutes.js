const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addToCart,
    getCart,
    updateCart,
    removeCartItem,
    clearCart
} = require("../controllers/cartController");

// Add Product to Cart
router.post("/", (req, res, next) => {
    console.log("CART ROUTE HIT");
    console.log("AUTH HEADER:", req.headers.authorization);
    next();
}, protect, addToCart);

// Get My Cart
router.get("/", protect, getCart);

// Update Quantity
router.put("/:id", protect, updateCart);

// Remove Item
router.delete("/:id", protect, removeCartItem);

// Clear Cart
router.delete("/", protect, clearCart);

module.exports = router;