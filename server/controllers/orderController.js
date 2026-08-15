const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const { sendEmail } = require("../services/emailService");


// =====================================================
// PLACE ORDER
// =====================================================

const placeOrder = async (req, res) => {
    try {
        const {
            shippingAddress,
            paymentMethod = "COD",
            paymentReference = "",
        } = req.body;


        // =================================================
        // AUTH CHECK
        // =================================================

        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Please login to place an order",
            });
        }


        // =================================================
        // SHIPPING VALIDATION
        // =================================================

        if (
            !shippingAddress?.fullName ||
            !shippingAddress?.phone ||
            !shippingAddress?.address ||
            !shippingAddress?.city ||
            !shippingAddress?.state ||
            !shippingAddress?.pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "Complete shipping address is required",
            });
        }


        // =================================================
        // PAYMENT VALIDATION
        // =================================================

        if (!["COD", "UPI"].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method",
            });
        }


        // =================================================
        // GET CART
        // =================================================

        const cartItems = await Cart.find({
            user: req.user.id,
        }).populate("product");


        if (!cartItems.length) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }


        // =================================================
        // VALIDATE PRODUCTS + STOCK
        // =================================================

        let totalPrice = 0;

        const items = [];


        for (const cartItem of cartItems) {
            const product = cartItem.product;


            if (!product) {
                return res.status(404).json({
                    success: false,
                    message:
                        "One of the products in your cart no longer exists",
                });
            }


            const quantity = Number(
                cartItem.quantity
            );


            const stock = Number(
                product.stock || 0
            );


            const price = Number(
                product.price || 0
            );


            if (quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product quantity",
                });
            }


            if (stock < quantity) {
                return res.status(400).json({
                    success: false,
                    message:
                        `${product.name} has insufficient stock`,
                });
            }


            if (price < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product price",
                });
            }


            totalPrice += price * quantity;


            items.push({
                product: product._id,
                quantity,
                size: cartItem.size || "",
                color: cartItem.color || "",
                price,
            });
        }


        // =================================================
        // GENERATE ORDER ID
        // =================================================

        const orderId =
            "BB" +
            Date.now()
                .toString()
                .slice(-8);


        // =================================================
        // CREATE ORDER
        // =================================================

        const order = await Order.create({

            user: req.user.id,

            items,

            totalPrice,

            shippingAddress: {
                fullName:
                    shippingAddress.fullName.trim(),

                phone:
                    shippingAddress.phone.trim(),

                address:
                    shippingAddress.address.trim(),

                city:
                    shippingAddress.city.trim(),

                state:
                    shippingAddress.state.trim(),

                pincode:
                    shippingAddress.pincode.trim(),
            },

            paymentMethod,

            paymentStatus: "Pending",

            paymentReference:
                paymentMethod === "UPI"
                    ? paymentReference.trim()
                    : "",

            orderId,

            orderStatus: "Pending",
        });


        // =================================================
        // REDUCE STOCK
        // =================================================

        for (const cartItem of cartItems) {

            const product =
                cartItem.product;


            product.stock =
                Number(product.stock || 0) -
                Number(cartItem.quantity);


            product.sold =
                Number(product.sold || 0) +
                Number(cartItem.quantity);


            await product.save();
        }


        // =================================================
        // CLEAR CART
        // =================================================

        await Cart.deleteMany({
            user: req.user.id,
        });


        // =================================================
        // CONFIRMATION EMAIL
        // =================================================

        try {

            const user =
                await User.findById(
                    req.user.id
                );


            if (user) {

                await sendEmail(

                    user.email,

                    `Order Confirmed - ${orderId}`,

                    `
                    <h2>
                        Hello ${user.name}
                    </h2>

                    <p>
                        Your BrandBlvd order has
                        been placed successfully.
                    </p>

                    <h3>
                        Order ID: ${orderId}
                    </h3>

                    <h3>
                        Total: ₹${totalPrice.toLocaleString(
                            "en-IN"
                        )}
                    </h3>

                    <p>
                        Payment Method:
                        ${paymentMethod}
                    </p>

                    <p>
                        Thank you for shopping
                        with BrandBlvd ❤️
                    </p>
                    `
                );
            }

        } catch (emailError) {

            console.error(
                "Order confirmation email failed:",
                emailError.message
            );
        }


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Order placed successfully",

            order,
        });


    } catch (error) {

        console.error(
            "Place order error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to place order",
        });
    }
};



// =====================================================
// GET MY ORDERS
// =====================================================

const getMyOrders = async (req, res) => {

    try {

        if (!req.user?.id) {

            return res.status(401).json({
                success: false,
                message: "Please login",
            });
        }


        const orders =
            await Order.find({
                user: req.user.id,
            })
                .populate("items.product")
                .sort({
                    createdAt: -1,
                });


        return res.json({

            success: true,

            orders,
        });


    } catch (error) {

        console.error(
            "Get my orders error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch orders",
        });
    }
};



// =====================================================
// GET SINGLE ORDER
// =====================================================

const getOrderById = async (req, res) => {

    try {

        if (!req.user?.id) {

            return res.status(401).json({
                success: false,
                message: "Please login",
            });
        }


        const order =
            await Order.findOne({

                _id: req.params.id,

                user: req.user.id,

            }).populate("items.product");


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found",
            });
        }


        return res.json({

            success: true,

            order,
        });


    } catch (error) {

        console.error(
            "Get order error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch order",
        });
    }
};



// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================

const getAllOrders = async (req, res) => {

    try {

        const orders =
            await Order.find()

                .populate(
                    "user",
                    "name email phone"
                )

                .populate(
                    "items.product"
                )

                .sort({
                    createdAt: -1,
                });


        return res.json({

            success: true,

            totalOrders:
                orders.length,

            orders,
        });


    } catch (error) {

        console.error(
            "Get all orders error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch orders",
        });
    }
};



// =====================================================
// UPDATE ORDER STATUS - ADMIN
// =====================================================

const updateOrderStatus = async (
    req,
    res
) => {

    try {

        const { status } =
            req.body;


        const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid order status",
            });
        }


        const order =
            await Order.findById(
                req.params.id
            ).populate("user");


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found",
            });
        }


        order.orderStatus =
            status;


        await order.save();


        // =================================================
        // STATUS EMAIL
        // =================================================

        try {

            if (order.user) {

                let subject = "";

                let message = "";


                if (
                    status === "Processing"
                ) {

                    subject =
                        "Order Processing - BrandBlvd";


                    message = `
                        <p>
                            Your order
                            <strong>
                                ${order.orderId}
                            </strong>
                            is now being processed.
                        </p>

                        <p>
                            We'll update you once
                            it is shipped.
                        </p>
                    `;
                }


                if (
                    status === "Shipped"
                ) {

                    subject =
                        "Order Shipped - BrandBlvd";


                    message = `
                        <p>
                            Your order
                            <strong>
                                ${order.orderId}
                            </strong>
                            has been shipped 🚚
                        </p>

                        <p>
                            It will reach you soon.
                        </p>
                    `;
                }


                if (
                    status === "Delivered"
                ) {

                    subject =
                        "Order Delivered - BrandBlvd";


                    message = `
                        <p>
                            Your order
                            <strong>
                                ${order.orderId}
                            </strong>
                            has been delivered
                            successfully ❤️
                        </p>

                        <p>
                            Thank you for shopping
                            with BrandBlvd.
                        </p>
                    `;
                }


                if (
                    status === "Cancelled"
                ) {

                    subject =
                        "Order Cancelled - BrandBlvd";


                    message = `
                        <p>
                            Your order
                            <strong>
                                ${order.orderId}
                            </strong>
                            has been cancelled.
                        </p>

                        <p>
                            Please contact BrandBlvd
                            support if you have
                            any questions.
                        </p>
                    `;
                }


                if (
                    subject &&
                    message
                ) {

                    await sendEmail(

                        order.user.email,

                        subject,

                        `
                        <h2>
                            Hello ${order.user.name}
                        </h2>

                        ${message}
                        `
                    );
                }
            }

        } catch (emailError) {

            console.error(
                "Order status email failed:",
                emailError.message
            );
        }


        return res.json({

            success: true,

            message:
                "Order status updated successfully",

            order,
        });


    } catch (error) {

        console.error(
            "Update order status error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to update order status",
        });
    }
};



// =====================================================
// UPDATE PAYMENT STATUS - ADMIN
// =====================================================

const updatePaymentStatus = async (
    req,
    res
) => {

    try {

        const {
            paymentStatus,
        } = req.body;


        const allowedStatuses = [
            "Pending",
            "Paid",
            "Rejected",
        ];


        if (
            !allowedStatuses.includes(
                paymentStatus
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid payment status",
            });
        }


        const order =
            await Order.findById(
                req.params.id
            ).populate("user");


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found",
            });
        }


        // =================================================
        // ONLY UPI ORDERS
        // =================================================

        if (
            order.paymentMethod !== "UPI"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment verification is only available for UPI orders",
            });
        }


        order.paymentStatus =
            paymentStatus;


        await order.save();


        // =================================================
        // OPTIONAL PAYMENT EMAIL
        // =================================================

        try {

            if (
                order.user &&
                order.user.email
            ) {

                let subject = "";

                let message = "";


                if (
                    paymentStatus === "Paid"
                ) {

                    subject =
                        "Payment Verified - BrandBlvd";


                    message = `
                        <p>
                            Your UPI payment for
                            order
                            <strong>
                                ${order.orderId}
                            </strong>
                            has been verified successfully.
                        </p>

                        <p>
                            Your order will now be
                            processed by our team.
                        </p>
                    `;
                }


                if (
                    paymentStatus === "Rejected"
                ) {

                    subject =
                        "Payment Verification Failed - BrandBlvd";


                    message = `
                        <p>
                            We could not verify the
                            UPI payment for order
                            <strong>
                                ${order.orderId}
                            </strong>.
                        </p>

                        <p>
                            Please contact BrandBlvd
                            support if you believe
                            this was a mistake.
                        </p>
                    `;
                }


                if (
                    subject &&
                    message
                ) {

                    await sendEmail(

                        order.user.email,

                        subject,

                        `
                        <h2>
                            Hello ${order.user.name}
                        </h2>

                        ${message}
                        `
                    );
                }
            }

        } catch (emailError) {

            console.error(
                "Payment email failed:",
                emailError.message
            );
        }


        return res.json({

            success: true,

            message:
                "Payment status updated successfully",

            order,
        });


    } catch (error) {

        console.error(
            "Update payment status error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to update payment status",
        });
    }
};



// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    placeOrder,

    getMyOrders,

    getOrderById,

    getAllOrders,

    updateOrderStatus,

    updatePaymentStatus,
};