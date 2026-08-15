const Product = require("../models/Product");

// Get Low Stock Products
const getLowStockProducts = async (req, res) => {

    try {

        const products = await Product.find();

        const lowStock = products.filter(product =>
            product.stock <= product.lowStockThreshold
        );

        res.json({
            success: true,
            total: lowStock.length,
            products: lowStock
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Update Stock
const updateStock = async (req, res) => {

    try {

        const { stock } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.stock = stock;

        await product.save();

        res.json({
            success: true,
            message: "Stock updated",
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getLowStockProducts,
    updateStock
};