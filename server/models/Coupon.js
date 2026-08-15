const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },

        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },

        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },

        maxDiscount: {
            type: Number,
            default: null,
            min: 0,
        },

        minimumOrderValue: {
            type: Number,
            default: 0,
            min: 0,
        },

        usageLimit: {
            type: Number,
            default: null,
            min: 0,
        },

        usedCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        perUserLimit: {
            type: Number,
            default: 1,
            min: 1,
        },

        expiresAt: {
            type: Date,
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Coupon", couponSchema);