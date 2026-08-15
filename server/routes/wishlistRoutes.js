const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addToWishlist,
    getWishlist,
    removeWishlist
} = require("../controllers/wishlistController");

// Add to Wishlist
router.post("/", protect, addToWishlist);

// Get My Wishlist
router.get("/", protect, getWishlist);

// Remove from Wishlist
router.delete("/:id", protect, removeWishlist);

module.exports = router;