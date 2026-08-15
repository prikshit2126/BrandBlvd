const Coupon = require("../models/Coupon");

/* =========================================================
   CREATE COUPON
========================================================= */

const createCoupon = async (req, res) => {
    try {
        let {
            code,
            discountType,
            discountValue,
            maxDiscount,
            minimumOrderValue,
            usageLimit,
            perUserLimit,
            expiresAt,
            isActive,
        } = req.body;

        code = code?.trim().toUpperCase();

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Coupon code is required",
            });
        }

        const existingCoupon = await Coupon.findOne({
            code,
        });

        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists",
            });
        }

        if (
            discountType === "percentage" &&
            Number(discountValue) > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Percentage discount cannot exceed 100%",
            });
        }

        const coupon = await Coupon.create({
            code,
            discountType,
            discountValue: Number(discountValue),
            maxDiscount:
                maxDiscount === "" ||
                maxDiscount === null
                    ? null
                    : Number(maxDiscount),

            minimumOrderValue:
                Number(minimumOrderValue || 0),

            usageLimit:
                usageLimit === "" ||
                usageLimit === null
                    ? null
                    : Number(usageLimit),

            perUserLimit:
                Number(perUserLimit || 1),

            expiresAt:
                expiresAt || null,

            isActive:
                isActive !== false &&
                isActive !== "false",
        });

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   GET ALL COUPONS
========================================================= */

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            coupons,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   GET SINGLE COUPON
========================================================= */

const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(
            req.params.id
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        res.json({
            success: true,
            coupon,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   UPDATE COUPON
========================================================= */

const updateCoupon = async (req, res) => {
    try {
        const coupon =
            await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        let {
            code,
            discountType,
            discountValue,
            maxDiscount,
            minimumOrderValue,
            usageLimit,
            perUserLimit,
            expiresAt,
            isActive,
        } = req.body;

        code = code?.trim().toUpperCase();

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Coupon code is required",
            });
        }

        const duplicate =
            await Coupon.findOne({
                code,
                _id: { $ne: req.params.id },
            });

        if (duplicate) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists",
            });
        }

        if (
            discountType === "percentage" &&
            Number(discountValue) > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Percentage discount cannot exceed 100%",
            });
        }

        coupon.code = code;
        coupon.discountType = discountType;
        coupon.discountValue =
            Number(discountValue);

        coupon.maxDiscount =
            maxDiscount === "" ||
            maxDiscount === null
                ? null
                : Number(maxDiscount);

        coupon.minimumOrderValue =
            Number(minimumOrderValue || 0);

        coupon.usageLimit =
            usageLimit === "" ||
            usageLimit === null
                ? null
                : Number(usageLimit);

        coupon.perUserLimit =
            Number(perUserLimit || 1);

        coupon.expiresAt =
            expiresAt || null;

        coupon.isActive =
            isActive !== false &&
            isActive !== "false";

        await coupon.save();

        res.json({
            success: true,
            message: "Coupon updated successfully",
            coupon,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   TOGGLE COUPON
========================================================= */

const toggleCoupon = async (req, res) => {
    try {
        const coupon =
            await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        coupon.isActive = !coupon.isActive;

        await coupon.save();

        res.json({
            success: true,
            message: coupon.isActive
                ? "Coupon activated"
                : "Coupon deactivated",
            coupon,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   DELETE COUPON
========================================================= */

const deleteCoupon = async (req, res) => {
    try {
        const coupon =
            await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        await coupon.deleteOne();

        res.json({
            success: true,
            message: "Coupon deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   VALIDATE COUPON
========================================================= */

const validateCoupon = async (req, res) => {
    try {
        const {
            code,
            orderAmount,
        } = req.body;

        const coupon =
            await Coupon.findOne({
                code: code?.trim().toUpperCase(),
            });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Invalid coupon code",
            });
        }

        if (!coupon.isActive) {
            return res.status(400).json({
                success: false,
                message: "This coupon is inactive",
            });
        }

        if (
            coupon.expiresAt &&
            new Date() > coupon.expiresAt
        ) {
            return res.status(400).json({
                success: false,
                message: "This coupon has expired",
            });
        }

        if (
            coupon.usageLimit !== null &&
            coupon.usedCount >=
                coupon.usageLimit
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "This coupon has reached its usage limit",
            });
        }

        const amount =
            Number(orderAmount || 0);

        if (
            amount <
            coupon.minimumOrderValue
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Minimum order value is ₹${coupon.minimumOrderValue}`,
            });
        }

        let discount = 0;

        if (
            coupon.discountType ===
            "percentage"
        ) {
            discount =
                (amount *
                    coupon.discountValue) /
                100;

            if (
                coupon.maxDiscount !== null
            ) {
                discount = Math.min(
                    discount,
                    coupon.maxDiscount
                );
            }
        } else {
            discount =
                coupon.discountValue;
        }

        discount = Math.min(
            discount,
            amount
        );

        res.json({
            success: true,
            message: "Coupon applied successfully",

            coupon: {
                id: coupon._id,
                code: coupon.code,
                discountType:
                    coupon.discountType,
                discountValue:
                    coupon.discountValue,
            },

            discount,
            finalAmount:
                amount - discount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    toggleCoupon,
    deleteCoupon,
    validateCoupon,
};