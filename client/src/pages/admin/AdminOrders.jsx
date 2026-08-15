import { useEffect, useState } from "react";

import {
    ArrowLeft,
    CheckCircle,
    Clock,
    Package,
    RefreshCw,
    Truck,
    XCircle,
    CreditCard,
} from "lucide-react";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import orderService from "../../services/orderService";

import "./AdminOrders.css";


// =====================================================
// ORDER STATUSES
// =====================================================

const ORDER_STATUSES = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
];


// =====================================================
// FALLBACK IMAGE
// =====================================================

const FALLBACK_IMAGE =
    "https://placehold.co/120x150/eeeeee/111111?text=BrandBlvd";


// =====================================================
// COMPONENT
// =====================================================

export default function AdminOrders() {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [updating, setUpdating] = useState("");

    const [paymentUpdating, setPaymentUpdating] =
        useState("");

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // FETCH ORDERS
    // =====================================================

    const fetchOrders = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await orderService.getAllOrders();

            if (!response.data?.success) {

                throw new Error(
                    response.data?.message ||
                    "Unable to load orders."
                );
            }

            setOrders(
                response.data.orders || []
            );

        } catch (err) {

            console.error(
                "Failed to load orders:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load orders."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchOrders();

    }, []);


    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    const updateStatus = async (
        orderId,
        status
    ) => {

        try {

            setUpdating(orderId);

            setError("");

            setSuccess("");

            const response =
                await orderService.updateOrderStatus(
                    orderId,
                    status
                );

            if (!response.data?.success) {

                throw new Error(
                    response.data?.message ||
                    "Unable to update order status."
                );
            }

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order._id === orderId
                        ? {
                            ...order,
                            orderStatus: status,
                        }
                        : order
                )
            );

            setSuccess(
                "Order status updated successfully."
            );

        } catch (err) {

            console.error(
                "Failed to update order:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to update order status."
            );

        } finally {

            setUpdating("");
        }
    };


    // =====================================================
    // UPDATE PAYMENT STATUS
    // =====================================================

    const updatePaymentStatus = async (
        orderId,
        paymentStatus
    ) => {

        try {

            setPaymentUpdating(orderId);

            setError("");

            setSuccess("");


            const response =
                await orderService.updatePaymentStatus(
                    orderId,
                    paymentStatus
                );


            if (!response.data?.success) {

                throw new Error(
                    response.data?.message ||
                    "Unable to update payment status."
                );
            }


            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order._id === orderId
                        ? {
                            ...order,
                            paymentStatus,
                        }
                        : order
                )
            );


            setSuccess(
                paymentStatus === "Paid"
                    ? "UPI payment marked as paid."
                    : "UPI payment rejected."
            );


        } catch (err) {

            console.error(
                "Failed to update payment:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to update payment status."
            );

        } finally {

            setPaymentUpdating("");
        }
    };


    // =====================================================
    // STATUS ICON
    // =====================================================

    const getStatusIcon = (status) => {

        switch (status) {

            case "Delivered":
                return <CheckCircle size={15} />;

            case "Shipped":
                return <Truck size={15} />;

            case "Cancelled":
                return <XCircle size={15} />;

            case "Processing":
                return <RefreshCw size={15} />;

            default:
                return <Clock size={15} />;
        }
    };


    // =====================================================
    // DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =====================================================
    // PAYMENT STATUS CLASS
    // =====================================================

    const getPaymentStatusClass = (
        status
    ) => {

        return (
            status
                ?.toLowerCase()
                .replace(/\s+/g, "-") ||
            "pending"
        );
    };


    // =====================================================
    // SHIPPING ADDRESS
    // =====================================================

    const getShippingAddress = (
        address
    ) => {

        if (!address) {
            return "No address provided";
        }

        if (typeof address === "string") {
            return address;
        }

        return [
            address.fullName,
            address.address,
            address.city,
            address.state,
            address.pincode,
            address.phone,
        ]
            .filter(Boolean)
            .join(", ");
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <main className="admin-orders-page">


            {/* =================================================
                TOP BAR
            ================================================= */}

            <header className="admin-orders-topbar">

                <Link
                    to="/admin"
                    className="admin-orders-back"
                >

                    <ArrowLeft size={16} />

                    Dashboard

                </Link>


                <Link
                    to="/"
                    className="admin-orders-logo"
                >
                    BrandBlvd
                </Link>

            </header>


            {/* =================================================
                CONTAINER
            ================================================= */}

            <div className="admin-orders-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <motion.section
                    className="admin-orders-heading"

                    initial={{
                        opacity: 0,
                        y: 20,
                    }}

                    animate={{
                        opacity: 1,
                        y: 0,
                    }}

                    transition={{
                        duration: 0.4,
                    }}
                >

                    <div>

                        <span>
                            STORE MANAGEMENT
                        </span>

                        <h1>
                            Orders
                        </h1>

                        <p>
                            Manage customer orders,
                            payments and delivery status.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="admin-refresh-button"

                        onClick={fetchOrders}

                        disabled={loading}
                    >

                        <RefreshCw
                            size={16}

                            className={
                                loading
                                    ? "is-spinning"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </motion.section>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="admin-orders-error">

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"

                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>

                    </div>
                )}


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (

                    <div className="admin-orders-success">

                        <CheckCircle size={16} />

                        <span>
                            {success}
                        </span>

                        <button
                            type="button"

                            onClick={() =>
                                setSuccess("")
                            }
                        >
                            ×
                        </button>

                    </div>
                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <div className="admin-orders-loading">

                        <RefreshCw
                            size={25}
                            className="is-spinning"
                        />

                        <span>
                            Loading orders...
                        </span>

                    </div>


                ) : orders.length === 0 ? (


                    /* =================================================
                        EMPTY
                    ================================================= */

                    <div className="admin-orders-empty">

                        <Package size={35} />

                        <h2>
                            No orders yet
                        </h2>

                        <p>
                            Customer orders will
                            appear here after a
                            purchase is completed.
                        </p>

                    </div>


                ) : (


                    /* =================================================
                        ORDER LIST
                    ================================================= */

                    <section className="admin-orders-list">

                        {orders.map((order) => {

                            const status =
                                order.orderStatus ||
                                "Pending";


                            const paymentStatus =
                                order.paymentStatus ||
                                "Pending";


                            const paymentMethod =
                                order.paymentMethod ||
                                "COD";


                            const isUPI =
                                paymentMethod
                                    .toUpperCase() ===
                                "UPI";


                            const isPaymentUpdating =
                                paymentUpdating ===
                                order._id;


                            return (

                                <motion.article
                                    className="admin-order-card"

                                    key={order._id}

                                    initial={{
                                        opacity: 0,
                                        y: 15,
                                    }}

                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}

                                    transition={{
                                        duration: 0.3,
                                    }}
                                >


                                    {/* =================================================
                                        ORDER HEADER
                                    ================================================= */}

                                    <div className="admin-order-header">

                                        <div>

                                            <span>
                                                ORDER
                                            </span>

                                            <strong>
                                                #
                                                {order.orderId ||
                                                    String(
                                                        order._id
                                                    ).slice(-8)}
                                            </strong>

                                            <small>
                                                {formatDate(
                                                    order.createdAt
                                                )}
                                            </small>

                                        </div>


                                        <div className="admin-order-status">

                                            {getStatusIcon(
                                                status
                                            )}

                                            <select
                                                value={status}

                                                disabled={
                                                    updating ===
                                                    order._id
                                                }

                                                onChange={(
                                                    event
                                                ) =>
                                                    updateStatus(
                                                        order._id,
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            >

                                                {ORDER_STATUSES.map(
                                                    (
                                                        statusOption
                                                    ) => (

                                                        <option
                                                            key={
                                                                statusOption
                                                            }

                                                            value={
                                                                statusOption
                                                            }
                                                        >
                                                            {
                                                                statusOption
                                                            }
                                                        </option>
                                                    )
                                                )}

                                            </select>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        CUSTOMER INFORMATION
                                    ================================================= */}

                                    <div className="admin-order-customer">

                                        <div>

                                            <span>
                                                CUSTOMER
                                            </span>

                                            <strong>
                                                {order.user?.name ||
                                                    "Unknown Customer"}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                EMAIL
                                            </span>

                                            <strong>
                                                {order.user?.email ||
                                                    "—"}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                PAYMENT
                                            </span>

                                            <strong>
                                                {paymentMethod}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                PAYMENT STATUS
                                            </span>

                                            <strong
                                                className={`payment-${getPaymentStatusClass(
                                                    paymentStatus
                                                )}`}
                                            >
                                                {
                                                    paymentStatus
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                TOTAL
                                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    order.totalPrice ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        UPI PAYMENT VERIFICATION
                                    ================================================= */}

                                    {isUPI && (

                                        <div className="admin-payment-verification">

                                            <div className="admin-payment-verification-info">

                                                <div className="admin-payment-icon">
                                                    <CreditCard
                                                        size={18}
                                                    />
                                                </div>

                                                <div>

                                                    <span>
                                                        UPI PAYMENT
                                                    </span>

                                                    <strong>
                                                        {paymentStatus ===
                                                        "Paid"
                                                            ? "Payment verified"
                                                            : paymentStatus ===
                                                              "Rejected"
                                                            ? "Payment rejected"
                                                            : "Payment awaiting verification"}
                                                    </strong>

                                                    <p>
                                                        Verify the customer's
                                                        UPI transaction before
                                                        processing the order.
                                                    </p>

                                                </div>

                                            </div>


                                            {paymentStatus !==
                                                "Paid" &&
                                                paymentStatus !==
                                                    "Rejected" && (

                                                    <div className="admin-payment-actions">

                                                        <button
                                                            type="button"

                                                            className="admin-payment-button paid"

                                                            disabled={
                                                                isPaymentUpdating
                                                            }

                                                            onClick={() =>
                                                                updatePaymentStatus(
                                                                    order._id,
                                                                    "Paid"
                                                                )
                                                            }
                                                        >

                                                            {isPaymentUpdating ? (
                                                                <RefreshCw
                                                                    size={15}
                                                                    className="is-spinning"
                                                                />
                                                            ) : (
                                                                <CheckCircle
                                                                    size={15}
                                                                />
                                                            )}

                                                            Mark Paid

                                                        </button>


                                                        <button
                                                            type="button"

                                                            className="admin-payment-button rejected"

                                                            disabled={
                                                                isPaymentUpdating
                                                            }

                                                            onClick={() =>
                                                                updatePaymentStatus(
                                                                    order._id,
                                                                    "Rejected"
                                                                )
                                                            }
                                                        >

                                                            <XCircle
                                                                size={15}
                                                            />

                                                            Reject

                                                        </button>

                                                    </div>
                                                )}

                                        </div>
                                    )}


                                    {/* =================================================
                                        PRODUCTS
                                    ================================================= */}

                                    <div className="admin-order-products">

                                        <span className="admin-order-label">
                                            PRODUCTS
                                        </span>


                                        {order.items?.map(
                                            (
                                                item,
                                                index
                                            ) => {

                                                const product =
                                                    item.product;


                                                const image =
                                                    product?.images?.[0];


                                                const itemPrice =
                                                    Number(
                                                        item.price ??
                                                        product?.price ??
                                                        0
                                                    );


                                                return (

                                                    <div
                                                        className="admin-order-product"

                                                        key={
                                                            item._id ||
                                                            index
                                                        }
                                                    >


                                                        <div className="admin-order-product-image">

                                                            {image ? (

                                                                <img
                                                                    src={
                                                                        image
                                                                    }

                                                                    alt={
                                                                        product?.name ||
                                                                        "Product"
                                                                    }

                                                                    onError={(
                                                                        event
                                                                    ) => {

                                                                        event.currentTarget.src =
                                                                            FALLBACK_IMAGE;

                                                                    }}
                                                                />

                                                            ) : (

                                                                <Package
                                                                    size={
                                                                        20
                                                                    }
                                                                />

                                                            )}

                                                        </div>


                                                        <div className="admin-order-product-info">

                                                            <strong>
                                                                {product?.name ||
                                                                    "Product unavailable"}
                                                            </strong>


                                                            <div className="admin-order-variant">

                                                                <span>
                                                                    Quantity:{" "}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>


                                                                {item.size && (

                                                                    <span>
                                                                        Size:{" "}
                                                                        {
                                                                            item.size
                                                                        }
                                                                    </span>

                                                                )}


                                                                {item.color && (

                                                                    <span>
                                                                        Colour:{" "}
                                                                        {
                                                                            item.color
                                                                        }
                                                                    </span>

                                                                )}

                                                            </div>

                                                        </div>


                                                        <strong className="admin-order-product-price">

                                                            ₹
                                                            {itemPrice.toLocaleString(
                                                                "en-IN"
                                                            )}

                                                        </strong>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>


                                    {/* =================================================
                                        SHIPPING
                                    ================================================= */}

                                    <div className="admin-order-shipping">

                                        <span>
                                            SHIPPING ADDRESS
                                        </span>

                                        <p>
                                            {getShippingAddress(
                                                order.shippingAddress
                                            )}
                                        </p>

                                    </div>


                                </motion.article>
                            );
                        })}

                    </section>
                )}

            </div>

        </main>
    );
}