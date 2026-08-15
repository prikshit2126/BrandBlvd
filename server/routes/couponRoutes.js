const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    toggleCoupon,
    deleteCoupon,
    validateCoupon,
} = require("../controllers/couponController");


/* =========================================================
   CUSTOMER
========================================================= */

router.post(
    "/validate",
    protect,
    validateCoupon
);


/* =========================================================
   ADMIN
========================================================= */

router.get(
    "/admin/all",
    protect,
    admin,
    getAllCoupons
);

router.get(
    "/admin/:id",
    protect,
    admin,
    getCouponById
);

router.post(
    "/admin",
    protect,
    admin,
    createCoupon
);

router.put(
    "/admin/:id",
    protect,
    admin,
    updateCoupon
);

router.put(
    "/admin/:id/toggle",
    protect,
    admin,
    toggleCoupon
);

router.delete(
    "/admin/:id",
    protect,
    admin,
    deleteCoupon
);


module.exports = router;