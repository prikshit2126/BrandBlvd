const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// Dashboard Stats
const getDashboardStats = async (req, res) => {

    try {

        const totalProducts = await Product.countDocuments();

        const totalCustomers = await User.countDocuments({
            role: "customer"
        });

        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: "Pending"
        });

        const pendingPayments = await Order.countDocuments({
            paymentStatus: "Pending"
        });

        const deliveredOrders = await Order.countDocuments({
            orderStatus: "Delivered"
        });

        const lowStockProducts = await Product.countDocuments({
            $expr: {
                $lte: ["$stock", "$lowStockThreshold"]
            }
        });

        const paidOrders = await Order.find({
            paymentStatus: "Paid"
        });

        const totalRevenue = paidOrders.reduce(
            (sum, order) => sum + order.totalPrice,
            0
        );

        res.json({
            success: true,
            stats: {
                totalRevenue,
                totalProducts,
                totalCustomers,
                totalOrders,
                pendingOrders,
                pendingPayments,
                deliveredOrders,
                lowStockProducts
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Monthly Sales
const getMonthlySales = async (req, res) => {

    try {

        const sales = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "Paid"
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    revenue: {
                        $sum: "$totalPrice"
                    },
                    orders: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        res.json({
            success: true,
            sales
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Recent Orders
const getRecentOrders = async (req, res) => {

    try {

        const orders = await Order.find()
            .populate("user", "name email")
            .sort({
                createdAt: -1
            })
            .limit(10);

        res.json({
            success: true,
            orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Best Selling Products
const getBestSellingProducts = async (req, res) => {

    try {

        const products = await Product.find()
            .sort({
                sold: -1
            })
            .limit(10);

        res.json({
            success: true,
            products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Top Customers
const getTopCustomers = async (req, res) => {

    try {

        const customers = await Order.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalSpent: {
                        $sum: "$totalPrice"
                    },
                    orders: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    totalSpent: -1
                }
            },
            {
                $limit: 10
            }
        ]);

        res.json({
            success: true,
            customers
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Inventory Report
const getInventoryReport = async (req, res) => {

    try {

        const products = await Product.find();

        res.json({
            success: true,
            totalProducts: products.length,
            products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {

    getDashboardStats,

    getMonthlySales,

    getRecentOrders,

    getBestSellingProducts,

    getTopCustomers,

    getInventoryReport

};