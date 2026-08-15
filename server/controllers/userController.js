const User = require("../models/User");
const Order = require("../models/Order");

// =====================================================
// GET ALL CUSTOMERS - ADMIN
// =====================================================

const getAllCustomers = async (req, res) => {
    try {
        // Get only customers
        const customers = await User.find({
            role: "customer",
        })
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();

        // Get all orders
        const orders = await Order.find()
            .select("user totalPrice orderStatus createdAt")
            .lean();

        // Add order information to each customer
        const customersWithStats = customers.map((customer) => {
            const customerOrders = orders.filter(
                (order) =>
                    String(order.user) ===
                    String(customer._id)
            );

            const totalSpent = customerOrders
                .filter(
                    (order) =>
                        order.orderStatus !== "Cancelled"
                )
                .reduce(
                    (total, order) =>
                        total +
                        Number(order.totalPrice || 0),
                    0
                );

            return {
                ...customer,

                orderCount: customerOrders.length,

                totalSpent,
            };
        });

        return res.json({
            success: true,

            totalCustomers:
                customersWithStats.length,

            customers: customersWithStats,
        });
    } catch (error) {
        console.error(
            "Get all customers error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to fetch customers",
        });
    }
};

module.exports = {
    getAllCustomers,
};