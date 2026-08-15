const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
    productValidation
} = require("../validators/productValidator");

const {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin Routes
router.post(
    "/",
    protect,
    admin,
    upload.array("images", 5),
    productValidation,
    validate,
    addProduct
);
router.put(
    "/:id",
    protect,
    admin,
    upload.array("images", 5),
    updateProduct
);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;