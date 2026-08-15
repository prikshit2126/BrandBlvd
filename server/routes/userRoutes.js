const express = require("express");

const router = express.Router();

const {
    getAllCustomers,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// =========================================
// ADMIN CUSTOMERS
// GET /api/users/admin/all
// =========================================
router.get(
    "/admin/all",
    protect,
    admin,
    getAllCustomers
);

module.exports = router;