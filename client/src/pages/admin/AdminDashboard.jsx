import { useEffect, useState } from "react";

import {
    Package,
    Plus,
    ShoppingBag,
    LogOut,
    ArrowRight,
    LayoutDashboard,
    ClipboardList,
    CreditCard,
    TicketPercent,
    Users,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import { motion } from "framer-motion";

import api from "../../services/api";

import "./AdminDashboard.css";


export default function AdminDashboard() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);


    // =====================================================
    // USER
    // =====================================================

    let user = null;

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "null"
        );
    } catch (error) {
        console.error(
            "Invalid user data in localStorage:",
            error
        );
    }


    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        const loadDashboardData = async () => {

            try {

                const [
                    productsResponse,
                    ordersResponse,
                ] = await Promise.all([
                    api.get("/products?limit=100"),
                    api.get("/orders/admin/all"),
                ]);


                // -------------------------------------------------
                // PRODUCTS
                // -------------------------------------------------

                if (
                    productsResponse.data?.success
                ) {

                    setProducts(
                        productsResponse.data.products || []
                    );

                }


                // -------------------------------------------------
                // ORDERS
                // -------------------------------------------------

                if (
                    ordersResponse.data?.success
                ) {

                    setOrders(
                        ordersResponse.data.orders || []
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to load dashboard data:",
                    error
                );

            } finally {

                setLoading(false);
                setOrdersLoading(false);

            }

        };


        loadDashboardData();

    }, []);


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate(
            "/admin/login",
            {
                replace: true,
            }
        );

    };


    // =====================================================
    // PRODUCT STATS
    // =====================================================

    const lowStockProducts =
        products.filter((product) => {

            const stock =
                Number(product.stock || 0);

            const threshold =
                Number(
                    product.lowStockThreshold ?? 5
                );

            return stock <= threshold;

        });


    const featuredProducts =
        products.filter(
            (product) =>
                product.isFeatured
        );


    // =====================================================
    // ORDER STATS
    // =====================================================

    const pendingOrders =
        orders.filter(
            (order) =>
                String(order.orderStatus)
                    .toLowerCase() === "pending"
        );


    const processingOrders =
        orders.filter(
            (order) =>
                String(order.orderStatus)
                    .toLowerCase() === "processing"
        );


    const shippedOrders =
        orders.filter(
            (order) =>
                String(order.orderStatus)
                    .toLowerCase() === "shipped"
        );


    const deliveredOrders =
        orders.filter(
            (order) =>
                String(order.orderStatus)
                    .toLowerCase() === "delivered"
        );


    // =====================================================
    // PAYMENT STATS
    // =====================================================

    const pendingPayments =
        orders.filter((order) => {

            const status =
                String(
                    order.paymentStatus || ""
                ).toLowerCase();

            return (
                status === "pending" ||
                !status
            );

        });


    const pendingUpiPayments =
        orders.filter((order) => {

            const paymentMethod =
                String(
                    order.paymentMethod || ""
                ).toLowerCase();

            const paymentStatus =
                String(
                    order.paymentStatus || ""
                ).toLowerCase();

            return (
                paymentMethod === "upi" &&
                (
                    paymentStatus === "pending" ||
                    !paymentStatus
                )
            );

        });


    // =====================================================
    // PAYMENT HELPERS
    // =====================================================

    const getPaymentMethod = (order) => {

        if (!order?.paymentMethod) {
            return "Not specified";
        }

        const method =
            String(
                order.paymentMethod
            ).toLowerCase();


        if (method === "upi") {
            return "UPI";
        }


        if (
            method === "cod" ||
            method === "cash"
        ) {
            return "Cash on Delivery";
        }


        return order.paymentMethod;

    };


    const getPaymentStatus = (order) => {

        if (!order?.paymentStatus) {
            return "Pending";
        }

        return order.paymentStatus;

    };


    const isPaymentPending = (order) => {

        const status =
            String(
                order?.paymentStatus || ""
            ).toLowerCase();

        return (
            status === "pending" ||
            !status
        );

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <main className="admin-dashboard">


            {/* =================================================
                TOPBAR
            ================================================= */}

            <header className="admin-topbar">

                <Link
                    to="/"
                    className="admin-logo"
                >
                    BrandBlvd
                </Link>


                <div className="admin-user">

                    <div>

                        <span>
                            ADMIN
                        </span>

                        <strong>
                            {user?.name ||
                                "Administrator"}
                        </strong>

                    </div>


                    <button
                        type="button"
                        onClick={logout}
                        title="Logout"
                        aria-label="Logout"
                    >
                        <LogOut size={17} />
                    </button>

                </div>

            </header>

            {/* =================================================
                MAIN CONTAINER
            ================================================= */}

            <div className="admin-container">


                {/* =================================================
                    WELCOME
                ================================================= */}

                <motion.section
                    className="admin-welcome"

                    initial={{
                        opacity: 0,
                        y: 20,
                    }}

                    animate={{
                        opacity: 1,
                        y: 0,
                    }}

                    transition={{
                        duration: 0.5,
                    }}
                >

                    <div>

                        <span>
                            STORE MANAGEMENT
                        </span>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Manage your BrandBlvd
                            men's clothing store.
                        </p>

                    </div>


                    <Link
                        to="/admin/products/new"
                        className="admin-primary-button"
                    >
                        <Plus size={18} />
                        Add Product
                    </Link>

                </motion.section>


                {/* =================================================
                    MAIN STATS
                ================================================= */}

                <section className="admin-stats">


                    {/* PRODUCTS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            <Package size={20} />
                        </div>

                        <div>

                            <span>
                                TOTAL PRODUCTS
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : products.length}
                            </strong>

                        </div>

                    </div>


                    {/* FEATURED */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            <ShoppingBag size={20} />
                        </div>

                        <div>

                            <span>
                                FEATURED
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : featuredProducts.length}
                            </strong>

                        </div>

                    </div>


                    {/* LOW STOCK */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            <Package size={20} />
                        </div>

                        <div>

                            <span>
                                LOW STOCK
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : lowStockProducts.length}
                            </strong>

                        </div>

                    </div>


                    {/* ORDERS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            <ClipboardList size={20} />
                        </div>

                        <div>

                            <span>
                                TOTAL ORDERS
                            </span>

                            <strong>
                                {ordersLoading
                                    ? "—"
                                    : orders.length}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <section className="admin-section">

                    <div className="admin-section-header">

                        <div>

                            <span>
                                MANAGEMENT
                            </span>

                            <h2>
                                Quick Actions
                            </h2>

                        </div>

                    </div>


                    <div className="admin-actions">


                        {/* =================================================
                            MANAGE ORDERS
                        ================================================= */}

                        <Link
                            to="/admin/orders"
                            className="admin-action-card"
                        >

                            <div>

                                <ClipboardList
                                    size={22}
                                />

                                <h3>
                                    Manage Orders
                                </h3>

                                <p>
                                    View customer orders,
                                    verify payments and
                                    update order status.
                                </p>

                            </div>

                            <ArrowRight size={18} />

                        </Link>


                        {/* =================================================
                            MANAGE PRODUCTS
                        ================================================= */}

                        <Link
                            to="/admin/products"
                            className="admin-action-card"
                        >

                            <div>

                                <LayoutDashboard
                                    size={22}
                                />

                                <h3>
                                    Manage Products
                                </h3>

                                <p>
                                    View, edit and remove
                                    products.
                                </p>

                            </div>

                            <ArrowRight size={18} />

                        </Link>


                        {/* =================================================
                            ADD PRODUCT
                        ================================================= */}

                        <Link
                            to="/admin/products/new"
                            className="admin-action-card"
                        >

                            <div>

                                <Plus size={22} />

                                <h3>
                                    Add Product
                                </h3>

                                <p>
                                    Add a new men's
                                    clothing product
                                    to the store.
                                </p>

                            </div>

                            <ArrowRight size={18} />

                        </Link>


                        {/* =================================================
                            MANAGE COUPONS
                        ================================================= */}

                        <Link
                            to="/admin/coupons"
                            className="admin-action-card"
                        >

                            <div>

                                <TicketPercent
                                    size={22}
                                />

                                <h3>
                                    Manage Coupons
                                </h3>

                                <p>
                                    Create, edit and manage
                                    discount coupons for
                                    your customers.
                                </p>

                            </div>

                            <ArrowRight size={18} />

                        </Link>


                        {/* =================================================
                            MANAGE CUSTOMERS
                        ================================================= */}

                        <Link
                            to="/admin/customers"
                            className="admin-action-card"
                        >

                            <div>

                                <Users
                                    size={22}
                                />

                                <h3>
                                    Manage Customers
                                </h3>

                                <p>
                                    View registered customers,
                                    orders and spending.
                                </p>

                            </div>

                            <ArrowRight
                                size={18}
                            />

                        </Link>


                    </div>

                </section>


                {/* =================================================
                    ORDER OVERVIEW
                ================================================= */}

                <section className="admin-section">

                    <div className="admin-section-header">

                        <div>

                            <span>
                                ORDERS
                            </span>

                            <h2>
                                Order Overview
                            </h2>

                        </div>


                        <Link
                            to="/admin/orders"
                            className="admin-view-all"
                        >
                            View Orders
                            <ArrowRight size={15} />
                        </Link>

                    </div>


                    <div className="admin-stats">


                        {/* TOTAL */}

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <ClipboardList
                                    size={20}
                                />
                            </div>

                            <div>

                                <span>
                                    TOTAL ORDERS
                                </span>

                                <strong>
                                    {ordersLoading
                                        ? "—"
                                        : orders.length}
                                </strong>

                            </div>

                        </div>


                        {/* PENDING */}

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <Package size={20} />
                            </div>

                            <div>

                                <span>
                                    PENDING
                                </span>

                                <strong>
                                    {ordersLoading
                                        ? "—"
                                        : pendingOrders.length}
                                </strong>

                            </div>

                        </div>


                        {/* PROCESSING */}

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <Package size={20} />
                            </div>

                            <div>

                                <span>
                                    PROCESSING
                                </span>

                                <strong>
                                    {ordersLoading
                                        ? "—"
                                        : processingOrders.length}
                                </strong>

                            </div>

                        </div>


                        {/* DELIVERED */}

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <ShoppingBag
                                    size={20}
                                />
                            </div>

                            <div>

                                <span>
                                    DELIVERED
                                </span>

                                <strong>
                                    {ordersLoading
                                        ? "—"
                                        : deliveredOrders.length}
                                </strong>

                            </div>

                        </div>


                        {/* PAYMENT PENDING */}

                        <div className="admin-stat-card admin-payment-stat">

                            <div className="admin-stat-icon">
                                <CreditCard
                                    size={20}
                                />
                            </div>

                            <div>

                                <span>
                                    PAYMENT PENDING
                                </span>

                                <strong>
                                    {ordersLoading
                                        ? "—"
                                        : pendingPayments.length}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    PAYMENT ALERT
                ================================================= */}

                {!ordersLoading &&
                    pendingUpiPayments.length > 0 && (

                        <section className="admin-section">

                            <div className="admin-payment-alert">

                                <div className="admin-payment-icon">

                                    <CreditCard
                                        size={20}
                                    />

                                </div>


                                <div className="admin-payment-content">

                                    <span>
                                        UPI PAYMENT
                                    </span>

                                    <h3>

                                        {
                                            pendingUpiPayments.length
                                        }{" "}

                                        {
                                            pendingUpiPayments.length === 1
                                                ? "payment"
                                                : "payments"
                                        }{" "}

                                        awaiting verification

                                    </h3>


                                    <p>
                                        Check the customer's
                                        UPI transaction reference
                                        and update the payment
                                        status.
                                    </p>

                                </div>


                                <Link
                                    to="/admin/orders"
                                    className="admin-payment-button"
                                >

                                    Verify Payments

                                    <ArrowRight
                                        size={15}
                                    />

                                </Link>

                            </div>

                        </section>

                    )}


                {/* =================================================
                    ORDER STATUS ALERT
                ================================================= */}

                {!ordersLoading &&
                    pendingOrders.length > 0 && (

                        <section className="admin-section">

                            <div className="admin-pending-orders">

                                <div className="admin-pending-icon">

                                    <ClipboardList
                                        size={20}
                                    />

                                </div>


                                <div className="admin-pending-content">

                                    <span>
                                        ACTION REQUIRED
                                    </span>

                                    <h3>

                                        {
                                            pendingOrders.length
                                        }{" "}

                                        {
                                            pendingOrders.length === 1
                                                ? "order"
                                                : "orders"
                                        }{" "}

                                        waiting for processing

                                    </h3>


                                    <p>
                                        Review the latest
                                        customer orders and
                                        update their status.
                                    </p>

                                </div>


                                <Link
                                    to="/admin/orders"
                                    className="admin-pending-button"
                                >

                                    Review Orders

                                    <ArrowRight
                                        size={15}
                                    />

                                </Link>

                            </div>

                        </section>

                    )}


                {/* =================================================
                    RECENT PRODUCTS
                ================================================= */}

                <section className="admin-section">

                    <div className="admin-section-header">

                        <div>

                            <span>
                                INVENTORY
                            </span>

                            <h2>
                                Recent Products
                            </h2>

                        </div>


                        <Link
                            to="/admin/products"
                            className="admin-view-all"
                        >
                            View All
                            <ArrowRight size={15} />
                        </Link>

                    </div>


                    {loading ? (

                        <div className="admin-empty">
                            Loading products...
                        </div>

                    ) : products.length === 0 ? (

                        <div className="admin-empty">

                            <Package size={30} />

                            <h3>
                                No products yet
                            </h3>

                            <p>
                                Add your first men's
                                clothing product.
                            </p>


                            <Link
                                to="/admin/products/new"
                                className="admin-empty-button"
                            >

                                Add First Product

                                <ArrowRight
                                    size={15}
                                />

                            </Link>

                        </div>

                    ) : (

                        <div className="admin-product-list">

                            {products
                                .slice(0, 6)
                                .map((product) => {

                                    const stock =
                                        Number(
                                            product.stock || 0
                                        );

                                    const threshold =
                                        Number(
                                            product.lowStockThreshold ?? 5
                                        );


                                    return (

                                        <div
                                            className="admin-product-row"
                                            key={product._id}
                                        >


                                            {/* IMAGE */}

                                            <div className="admin-product-image">

                                                {product.images?.[0] ? (

                                                    <img
                                                        src={
                                                            product.images[0]
                                                        }
                                                        alt={
                                                            product.name
                                                        }
                                                    />

                                                ) : (

                                                    <Package
                                                        size={20}
                                                    />

                                                )}

                                            </div>


                                            {/* PRODUCT */}

                                            <div className="admin-product-info">

                                                <strong>
                                                    {product.name}
                                                </strong>

                                                <span>
                                                    {product.category}
                                                </span>

                                            </div>


                                            {/* PRICE */}

                                            <div className="admin-product-price">

                                                ₹
                                                {Number(
                                                    product.price || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </div>


                                            {/* STOCK */}

                                            <div
                                                className={`admin-stock ${stock <= threshold
                                                        ? "low"
                                                        : ""
                                                    }`}
                                            >
                                                {stock} in stock
                                            </div>

                                        </div>

                                    );

                                })}

                        </div>

                    )}

                </section>


                {/* =================================================
                    RECENT ORDERS
                ================================================= */}

                {!ordersLoading &&
                    orders.length > 0 && (

                        <section className="admin-section">

                            <div className="admin-section-header">

                                <div>

                                    <span>
                                        LATEST ACTIVITY
                                    </span>

                                    <h2>
                                        Recent Orders
                                    </h2>

                                </div>


                                <Link
                                    to="/admin/orders"
                                    className="admin-view-all"
                                >
                                    View All
                                    <ArrowRight
                                        size={15}
                                    />
                                </Link>

                            </div>


                            <div className="admin-recent-orders">

                                {orders
                                    .slice(0, 5)
                                    .map((order) => (

                                        <div
                                            className="admin-recent-order"
                                            key={order._id}
                                        >


                                            <div>

                                                <span>
                                                    ORDER
                                                </span>

                                                <strong>
                                                    #
                                                    {String(
                                                        order._id
                                                    ).slice(-8)}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    PAYMENT
                                                </span>

                                                <strong>
                                                    {getPaymentMethod(
                                                        order
                                                    )}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    STATUS
                                                </span>

                                                <strong>
                                                    {getPaymentStatus(
                                                        order
                                                    )}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    ORDER STATUS
                                                </span>

                                                <strong>
                                                    {
                                                        order.orderStatus ||
                                                        "Pending"
                                                    }
                                                </strong>

                                            </div>


                                            <div
                                                className={
                                                    isPaymentPending(
                                                        order
                                                    )
                                                        ? "payment-pending"
                                                        : "payment-paid"
                                                }
                                            >

                                                {
                                                    isPaymentPending(
                                                        order
                                                    )
                                                        ? "Payment Pending"
                                                        : "Payment Verified"
                                                }

                                            </div>


                                        </div>

                                    ))}

                            </div>

                        </section>

                    )}


            </div>

        </main>

    );

}