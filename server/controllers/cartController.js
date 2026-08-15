const Cart = require("../models/Cart");

// ==========================
// Add to Cart
// ==========================
const addToCart = async (req, res) => {
    try {
        const {
            productId,
            quantity,
            size,
            color
        } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // Check if the exact same
        // product + size + colour
        // already exists in cart
        let cartItem = await Cart.findOne({
            user: req.user.id,
            product: productId,
            size: size || "",
            color: color || ""
        });

        if (cartItem) {

            cartItem.quantity +=
                Number(quantity) || 1;

            await cartItem.save();

            return res.json({
                success: true,
                message: "Cart updated",
                cart: cartItem
            });
        }

        // Create new cart item
        cartItem = await Cart.create({
            user: req.user.id,
            product: productId,
            quantity:
                Number(quantity) || 1,
            size: size || "",
            color: color || ""
        });

        res.status(201).json({
            success: true,
            message: "Added to cart",
            cart: cartItem
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==========================
// Get My Cart
// ==========================
const getCart = async (req, res) => {
    try {

        const cart = await Cart.find({
            user: req.user.id
        }).populate("product");

        let total = 0;

        cart.forEach((item) => {

            if (item.product) {
                total +=
                    item.product.price *
                    item.quantity;
            }

        });

        res.json({
            success: true,
            total,
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==========================
// Update Quantity
// ==========================
const updateCart = async (req, res) => {
    try {

        const {
            quantity
        } = req.body;

        if (
            !quantity ||
            Number(quantity) < 1
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be at least 1"
            });
        }

        const cart = await Cart.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message:
                    "Cart item not found"
            });
        }

        cart.quantity =
            Number(quantity);

        await cart.save();

        res.json({
            success: true,
            message: "Cart updated",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==========================
// Remove Item
// ==========================
const removeCartItem = async (req, res) => {
    try {

        const cart = await Cart.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message:
                    "Cart item not found"
            });
        }

        res.json({
            success: true,
            message:
                "Item removed from cart"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==========================
// Clear Cart
// ==========================
const clearCart = async (req, res) => {
    try {

        await Cart.deleteMany({
            user: req.user.id
        });

        res.json({
            success: true,
            message: "Cart cleared"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeCartItem,
    clearCart
};