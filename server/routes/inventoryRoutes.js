const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    getLowStockProducts,
    updateStock
} = require("../controllers/inventoryController");

router.get("/low-stock", protect, admin, getLowStockProducts);

router.put("/:id", protect, admin, updateStock);

module.exports = router;