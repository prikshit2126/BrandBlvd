const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

// Public
router.get("/", getCategories);

// Admin
router.post("/", protect, admin, addCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;