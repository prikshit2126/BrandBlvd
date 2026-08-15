const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    getPaymentDetails,
    uploadPayment,
    getPendingPayments,
    approvePayment,
    rejectPayment
} = require("../controllers/paymentController");

// ==========================
// Public
// ==========================
router.get("/", getPaymentDetails);

// ==========================
// Customer
// ==========================
router.post(
    "/upload",
    protect,
    upload.single("payment"),
    uploadPayment
);

// ==========================
// Admin
// ==========================
router.get(
    "/pending",
    protect,
    admin,
    getPendingPayments
);

router.put(
    "/approve/:id",
    protect,
    admin,
    approvePayment
);

router.put(
    "/reject/:id",
    protect,
    admin,
    rejectPayment
);

module.exports = router;