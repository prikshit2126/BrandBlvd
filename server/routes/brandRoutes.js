const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    addBrand,
    getBrands,
    updateBrand,
    deleteBrand
} = require("../controllers/brandController");

// Public
router.get("/", getBrands);

// Admin
router.post("/", protect, admin, addBrand);
router.put("/:id", protect, admin, updateBrand);
router.delete("/:id", protect, admin, deleteBrand);

module.exports = router;