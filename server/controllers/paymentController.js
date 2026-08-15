const paymentConfig = require("../config/payment");
const Order = require("../models/Order");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const { sendEmail } = require("../services/emailService");

// =========================
// Get UPI Details
// =========================
const getPaymentDetails = async (req, res) => {

    res.json({
        success: true,
        upiId: paymentConfig.upiId,
        merchant: paymentConfig.merchantName,
        qrImage: "/images/payment-qr.png"
    });

};

// =========================
// Upload Payment Screenshot
// =========================
const uploadPayment = async (req, res) => {

    try {

        const { orderId, paymentReference } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        let screenshot = "";

        if (req.file) {

            const result = await new Promise((resolve, reject) => {

                cloudinary.uploader.upload_stream(
                    {
                        folder: "BrandBlvd/Payments"
                    },
                    (error, result) => {

                        if (error) reject(error);
                        else resolve(result);

                    }
                ).end(req.file.buffer);

            });

            screenshot = result.secure_url;

        }

        order.paymentScreenshot = screenshot;
        order.paymentReference = paymentReference;
        order.paymentStatus = "Pending";

        await order.save();

        res.json({
            success: true,
            message: "Payment submitted successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// Pending Payments
// =========================
const getPendingPayments = async (req, res) => {

    try {

        const orders = await Order.find({
            paymentStatus: "Pending"
        }).populate("user", "name email");

        res.json({
            success: true,
            total: orders.length,
            orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// Approve Payment
// =========================
const approvePayment = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.paymentStatus = "Paid";
        order.orderStatus = "Processing";

        await order.save();

        res.json({
            success: true,
            message: "Payment approved",
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// Reject Payment
// =========================
const rejectPayment = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.paymentStatus = "Rejected";

        await order.save();

        res.json({
            success: true,
            message: "Payment rejected",
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {

    getPaymentDetails,

    uploadPayment,

    getPendingPayments,

    approvePayment,

    rejectPayment

};