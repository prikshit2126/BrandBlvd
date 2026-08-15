const mongoose = require("mongoose");

/* =========================================================
   REVIEW SCHEMA
========================================================= */

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        name: {
            type: String,
            trim: true,
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);


/* =========================================================
   PRODUCT SCHEMA
========================================================= */

const productSchema = new mongoose.Schema(
    {
        /* =====================================================
           BASIC INFORMATION
        ===================================================== */

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },


        /* =====================================================
           PRICING
        ===================================================== */

        // Current selling price
        // Example: ₹5,999
        price: {
            type: Number,
            required: true,
            min: 0,
        },

        // Original / MRP / Compare-at price
        // Example: ₹7,999
        originalPrice: {
            type: Number,
            default: null,
            min: 0,
        },


        /* =====================================================
           PRODUCT DETAILS
        ===================================================== */

        category: {
            type: String,
            required: true,
            trim: true,
        },

        brand: {
            type: String,
            default: "BrandBlvd",
            trim: true,
        },


        /* =====================================================
           INVENTORY
        ===================================================== */

        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },

        lowStockThreshold: {
            type: Number,
            default: 5,
            min: 0,
        },

        sold: {
            type: Number,
            default: 0,
            min: 0,
        },


        /* =====================================================
           PRODUCT OPTIONS
        ===================================================== */

        sizes: [
            {
                type: String,
                trim: true,
            },
        ],

        colors: [
            {
                type: String,
                trim: true,
            },
        ],


        /* =====================================================
           IMAGES
        ===================================================== */

        images: [
            {
                type: String,
                trim: true,
            },
        ],


        /* =====================================================
           STORE SETTINGS
        ===================================================== */

        isVisible: {
            type: Boolean,
            default: true,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },


        /* =====================================================
           RATINGS
        ===================================================== */

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        numReviews: {
            type: Number,
            default: 0,
            min: 0,
        },


        /* =====================================================
           REVIEWS
        ===================================================== */

        reviews: [
            reviewSchema,
        ],
    },

    {
        timestamps: true,
    }
);


/* =========================================================
   MODEL
========================================================= */

const Product = mongoose.model(
    "Product",
    productSchema
);

module.exports = Product;