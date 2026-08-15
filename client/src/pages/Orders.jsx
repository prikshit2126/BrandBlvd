import { useCallback, useEffect, useState } from "react";

import {
    CheckCircle2,
    ChevronDown,
    Circle,
    Clock3,
    Package,
    RefreshCw,
    ShoppingBag,
    Truck,
    XCircle,
} from "lucide-react";

import {
    Link,
    useSearchParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import Navbar from "../components/Navbar/Navbar";
import orderService from "../services/orderService";

import "./Orders.css";


// =====================================================
// FALLBACK IMAGE
// =====================================================

const FALLBACK_IMAGE =
    "https://placehold.co/600x750/eeeeee/111111?text=BrandBlvd";


// =====================================================
// ORDER STATUS
// =====================================================

const ORDER_STEPS = [
    {
        key: "Pending",
        label: "Order Placed",
        icon: Package,
    },
    {
        key: "Processing",
        label: "Processing",
        icon: Clock3,
    },
    {
        key: "Shipped",
        label: "Shipped",
        icon: Truck,
    },
    {
        key: "Delivered",
        label: "Delivered",
        icon: CheckCircle2,
    },
];


// =====================================================
// STATUS ORDER
// =====================================================

const STATUS_INDEX = {
    Pending: 0,
    Processing: 1,
    Shipped: 2,
    Delivered: 3,
};


// =====================================================
// MAIN ORDERS PAGE
// =====================================================

export default function Orders() {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [searchParams, setSearchParams] =
        useSearchParams();


    const success =
        searchParams.get("success") === "true";


    const newOrderId =
        searchParams.get("order");


    // =================================================
    // FETCH ORDERS
    // =================================================

    const fetchOrders = useCallback(
        async (showRefresh = false) => {

            try {

                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");


                const response =
                    await orderService.getMyOrders();


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
                    "Failed to fetch orders:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to load your orders."
                );


            } finally {

                setLoading(false);
                setRefreshing(false);
            }

        },
        []
    );


    // =================================================
    // INITIAL LOAD
    // =================================================

    useEffect(() => {

        if (
            localStorage.getItem("token")
        ) {

            fetchOrders();

        } else {

            setLoading(false);

        }

    }, [fetchOrders]);


    // =================================================
    // CLOSE SUCCESS MESSAGE
    // =================================================

    const closeSuccessMessage = () => {

        setSearchParams({});
    };


    // =================================================
    // LOGIN REQUIRED
    // =================================================

    if (!localStorage.getItem("token")) {

        return (
            <>
                <Navbar />

                <main className="orders-page">

                    <div className="orders-empty">

                        <Package size={32} />

                        <h1>
                            Login Required
                        </h1>

                        <p>
                            Login to view your
                            orders.
                        </p>

                        <Link to="/login">
                            Login
                        </Link>

                    </div>

                </main>
            </>
        );
    }


    // =================================================
    // PAGE
    // =================================================

    return (
        <>
            <Navbar />

            <main className="orders-page">

                {/* =========================================
                    SUCCESS
                ========================================= */}

                {success && (

                    <motion.section
                        className="order-success"

                        initial={{
                            opacity: 0,
                            y: -20,
                        }}

                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                    >

                        <div className="success-icon">
                            <CheckCircle2
                                size={30}
                            />
                        </div>

                        <div>

                            <span>
                                ORDER CONFIRMED
                            </span>

                            <h1>
                                Thank you for
                                your order.
                            </h1>

                            <p>
                                Your order has
                                been placed
                                successfully.
                            </p>

                            {newOrderId && (

                                <small>
                                    Order ID:{" "}
                                    <strong>
                                        {newOrderId}
                                    </strong>
                                </small>
                            )}

                        </div>

                        <button
                            type="button"
                            className="order-success-close"
                            onClick={
                                closeSuccessMessage
                            }
                        >
                            ×
                        </button>

                    </motion.section>
                )}


                {/* =========================================
                    HEADER
                ========================================= */}

                <section className="orders-header">

                    <div>

                        <span>
                            BRAND BLVD / ACCOUNT
                        </span>

                        <h1>
                            My Orders
                        </h1>

                        <p>
                            Track and review your
                            previous purchases.
                        </p>

                    </div>


                    <div className="orders-header-actions">

                        <button
                            type="button"
                            className="orders-refresh"
                            onClick={() =>
                                fetchOrders(true)
                            }
                            disabled={refreshing}
                        >

                            <RefreshCw
                                size={15}
                                className={
                                    refreshing
                                        ? "orders-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>


                        <Link to="/shop">

                            <ShoppingBag
                                size={16}
                            />

                            Continue Shopping

                        </Link>

                    </div>

                </section>


                {/* =========================================
                    LOADING
                ========================================= */}

                {loading ? (

                    <div className="orders-loading">

                        {Array.from({
                            length: 3,
                        }).map((_, index) => (

                            <div
                                className="order-skeleton"
                                key={index}
                            >
                                <div />
                                <div />
                                <div />
                            </div>

                        ))}

                    </div>


                ) : error ? (


                    /* =====================================
                        ERROR
                    ===================================== */

                    <div className="orders-message">

                        <Package size={30} />

                        <h2>
                            Something went wrong
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                fetchOrders()
                            }
                        >
                            Try Again
                        </button>

                    </div>


                ) : orders.length === 0 ? (


                    /* =====================================
                        EMPTY
                    ===================================== */

                    <div className="orders-empty">

                        <Package size={32} />

                        <h2>
                            No orders yet
                        </h2>

                        <p>
                            Your purchases will
                            appear here after you
                            place your first order.
                        </p>

                        <Link to="/shop">
                            Start Shopping
                        </Link>

                    </div>


                ) : (


                    /* =====================================
                        ORDERS
                    ===================================== */

                    <section className="orders-list">

                        {orders.map((order) => (

                            <OrderCard
                                key={order._id}
                                order={order}
                                highlight={
                                    order._id ===
                                        newOrderId ||
                                    order.orderId ===
                                        newOrderId
                                }
                            />

                        ))}

                    </section>
                )}

            </main>
        </>
    );
}


// =====================================================
// ORDER CARD
// =====================================================

function OrderCard({
    order,
    highlight = false,
}) {

    const [open, setOpen] =
        useState(highlight);


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    const status =
        order.orderStatus ||
        "Pending";


    const displayOrderId =
        order.orderId ||
        String(
            order._id || ""
        ).slice(-8);


    const itemCount =
        items.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.quantity || 0
                ),
            0
        );


    const isCancelled =
        status === "Cancelled";


    const currentStatusIndex =
        STATUS_INDEX[status] ?? 0;


    // =================================================
    // PAYMENT
    // =================================================

    const paymentMethod =
        order.paymentMethod ||
        "COD";


    const paymentStatus =
        order.paymentStatus ||
        "Pending";


    const isUPI =
        paymentMethod
            .toUpperCase() ===
        "UPI";


    // =================================================
    // STATUS CLASS
    // =================================================

    const statusClass =
        status
            .toLowerCase()
            .replace(/\s+/g, "-");


    // =================================================
    // DATE
    // =================================================

    const orderDate =
        order.createdAt
            ? new Date(
                order.createdAt
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }
            )
            : "—";


    return (

        <motion.article
            className={`order-card ${
                highlight
                    ? "order-card-highlight"
                    : ""
            }`}

            initial={{
                opacity: 0,
                y: 15,
            }}

            animate={{
                opacity: 1,
                y: 0,
            }}

            transition={{
                duration: 0.35,
            }}
        >

            {/* =========================================
                TOP
            ========================================= */}

            <div className="order-top">

                <div>

                    <span>
                        ORDER
                    </span>

                    <strong>
                        #{displayOrderId}
                    </strong>

                    <small>
                        {orderDate}
                    </small>

                </div>


                <div className="order-top-right">

                    <div
                        className={`order-status ${statusClass}`}
                    >
                        {status}
                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            setOpen(
                                (value) =>
                                    !value
                            )
                        }
                    >

                        {open
                            ? "Hide Details"
                            : "View Details"}

                        <ChevronDown
                            size={15}
                            className={
                                open
                                    ? "chevron-open"
                                    : ""
                            }
                        />

                    </button>

                </div>

            </div>


            {/* =========================================
                TRACKING
            ========================================= */}

            <OrderTracking
                status={status}
                isCancelled={isCancelled}
                currentStatusIndex={
                    currentStatusIndex
                }
            />


            {/* =========================================
                SUMMARY
            ========================================= */}

            <div className="order-summary-row">

                <div className="order-mini-products">

                    {items
                        .slice(0, 4)
                        .map(
                            (
                                item,
                                index
                            ) => {

                                const product =
                                    item.product;

                                const image =
                                    product?.images?.[0];


                                return (

                                    <div
                                        className="order-mini-image"
                                        key={
                                            item._id ||
                                            index
                                        }
                                    >

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

                                            <span>
                                                BB
                                            </span>
                                        )}

                                    </div>
                                );
                            }
                        )}

                </div>


                <div className="order-total">

                    <span>
                        {itemCount}{" "}
                        {itemCount === 1
                            ? "Item"
                            : "Items"}
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


            {/* =========================================
                DETAILS
            ========================================= */}

            {open && (

                <motion.div
                    className="order-details"

                    initial={{
                        opacity: 0,
                        height: 0,
                    }}

                    animate={{
                        opacity: 1,
                        height: "auto",
                    }}

                    transition={{
                        duration: 0.3,
                    }}
                >

                    {/* =================================
                        ORDER INFO
                    ================================= */}

                    <div className="order-details-grid">

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
                                className={`customer-payment-status ${paymentStatus
                                    .toLowerCase()
                                    .replace(
                                        /\s+/g,
                                        "-"
                                    )}`}
                            >
                                {paymentStatus}
                            </strong>

                        </div>


                        <div>

                            <span>
                                ITEMS
                            </span>

                            <strong>
                                {itemCount}
                            </strong>

                        </div>


                        {isUPI && (
                            <div>

                                <span>
                                    UPI REFERENCE
                                </span>

                                <strong>
                                    {order.paymentReference ||
                                        "Not provided"}
                                </strong>

                            </div>
                        )}

                    </div>


                    {/* =================================
                        PRODUCTS
                    ================================= */}

                    <div className="order-products">

                        {items.map(
                            (
                                item,
                                index
                            ) => {

                                const product =
                                    item.product;


                                if (!product) {

                                    return (

                                        <div
                                            className="order-product"
                                            key={
                                                item._id ||
                                                index
                                            }
                                        >

                                            <div className="order-product-image">

                                                <span>
                                                    BB
                                                </span>

                                            </div>


                                            <div>

                                                <strong>
                                                    Product unavailable
                                                </strong>

                                                <span>
                                                    Quantity:{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                            </div>


                                            <strong>
                                                ₹
                                                {Number(
                                                    item.price ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                        </div>
                                    );
                                }


                                const image =
                                    product.images?.[0];


                                const itemPrice =
                                    Number(
                                        item.price ??
                                        product.price ??
                                        0
                                    );


                                return (

                                    <div
                                        className="order-product"
                                        key={
                                            item._id ||
                                            index
                                        }
                                    >

                                        <div className="order-product-image">

                                            {image ? (

                                                <img
                                                    src={
                                                        image
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                    onError={(
                                                        event
                                                    ) => {

                                                        event.currentTarget.src =
                                                            FALLBACK_IMAGE;

                                                    }}
                                                />

                                            ) : (

                                                <span>
                                                    BB
                                                </span>
                                            )}

                                        </div>


                                        <div>

                                            <strong>
                                                {
                                                    product.name
                                                }
                                            </strong>

                                            <span>
                                                Quantity:{" "}
                                                {
                                                    item.quantity
                                                }
                                            </span>


                                            {item.size && (

                                                <span>
                                                    Size:{" "}
                                                    <strong>
                                                        {
                                                            item.size
                                                        }
                                                    </strong>
                                                </span>

                                            )}


                                            {item.color && (

                                                <span>
                                                    Colour:{" "}
                                                    <strong>
                                                        {
                                                            item.color
                                                        }
                                                    </strong>
                                                </span>

                                            )}

                                        </div>


                                        <strong>
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


                    {/* =================================
                        DELIVERY ADDRESS
                    ================================= */}

                    {order.shippingAddress && (

                        <div className="delivery-address">

                            <span>
                                DELIVERY ADDRESS
                            </span>

                            <p>

                                <strong>
                                    {
                                        order
                                            .shippingAddress
                                            .fullName
                                    }
                                </strong>

                                <br />

                                {
                                    order
                                        .shippingAddress
                                        .address
                                }

                                <br />

                                {
                                    order
                                        .shippingAddress
                                        .city
                                }
                                ,{" "}
                                {
                                    order
                                        .shippingAddress
                                        .state
                                }
                                {" - "}
                                {
                                    order
                                        .shippingAddress
                                        .pincode
                                }

                                <br />

                                {
                                    order
                                        .shippingAddress
                                        .phone
                                }

                            </p>

                        </div>
                    )}

                </motion.div>
            )}

        </motion.article>
    );
}


// =====================================================
// ORDER TRACKING
// =====================================================

function OrderTracking({
    status,
    isCancelled,
    currentStatusIndex,
}) {

    if (isCancelled) {

        return (

            <div className="order-tracking cancelled">

                <div className="tracking-cancelled-icon">
                    <XCircle size={20} />
                </div>

                <div>

                    <span>
                        ORDER STATUS
                    </span>

                    <strong>
                        Order Cancelled
                    </strong>

                    <p>
                        This order has been
                        cancelled.
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="order-tracking">

            {ORDER_STEPS.map(
                (
                    step,
                    index
                ) => {

                    const Icon =
                        step.icon;

                    const completed =
                        index <=
                        currentStatusIndex;


                    return (

                        <div
                            className={`tracking-step ${
                                completed
                                    ? "completed"
                                    : ""
                            }`}
                            key={step.key}
                        >

                            <div className="tracking-icon">

                                {completed ? (

                                    <Icon
                                        size={15}
                                    />

                                ) : (

                                    <Circle
                                        size={10}
                                    />

                                )}

                            </div>


                            <span>
                                {step.label}
                            </span>


                            {index <
                                ORDER_STEPS.length -
                                    1 && (

                                <div
                                    className={`tracking-line ${
                                        index <
                                        currentStatusIndex
                                            ? "completed"
                                            : ""
                                    }`}
                                />

                            )}

                        </div>
                    );
                }
            )}

        </div>
    );
}