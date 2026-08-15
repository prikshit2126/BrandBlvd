const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview
} = require("../controllers/reviewController");

router.post("/", protect, addReview);

router.get("/:productId", getProductReviews);

router.put("/:id", protect, updateReview);

router.delete("/:id", protect, deleteReview);

module.exports = router;