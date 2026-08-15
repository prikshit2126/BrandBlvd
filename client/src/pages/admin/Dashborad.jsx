import { Link } from "react-router-dom";
import {
    ClipboardList,
    Grid2X2,
    Plus,
    TicketPercent,
    ArrowRight,
    Package,
    CreditCard,
    Users,
    BarChart3,
} from "lucide-react";

import "./Dashboard.css";

export default function Dashboard() {
    return (
        <div className="admin-dashboard">

            {/* =====================================================
                TOP BAR
            ===================================================== */}

            <header className="admin-topbar">

                <Link
                    to="/admin"
                    className="admin-logo"
                >
                    BrandBlvd
                </Link>

                <div className="admin-user">
                    <div>
                        <span>ADMIN PANEL</span>
                        <strong>Administrator</strong>
                    </div>

                    <Link
                        to="/"
                        className="admin-back-store"
                    >
                        View Store
                    </Link>
                </div>

            </header>


            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="admin-container">

                {/* =================================================
                    WELCOME
                ================================================= */}

                <section className="admin-welcome">

                    <div>
                        <span>BRANDBLVD ADMINISTRATION</span>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Manage your store, products,
                            orders and promotions.
                        </p>
                    </div>

                    <Link
                        to="/admin/products/add"
                        className="admin-primary-button"
                    >
                        <Plus size={17} />
                        Add Product
                    </Link>

                </section>


                {/* =================================================
                    STATS
                ================================================= */}

                <section className="admin-stats">

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            <ClipboardList size={19} />
                        </div>

                        <div>
                            <span>TOTAL ORDERS</span>
                            <strong>—</strong>
                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            <Package size={19} />
                        </div>

                        <div>
                            <span>PRODUCTS</span>
                            <strong>—</strong>
                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            <CreditCard size={19} />
                        </div>

                        <div>
                            <span>PAYMENTS</span>
                            <strong>—</strong>
                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            <Users size={19} />
                        </div>

                        <div>
                            <span>CUSTOMERS</span>
                            <strong>—</strong>
                        </div>

                    </div>

                </section>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <section className="admin-section">

                    <div className="admin-section-header">

                        <div>
                            <span>MANAGEMENT</span>

                            <h2>
                                Quick Actions
                            </h2>
                        </div>

                    </div>


                    <div className="admin-actions">

                        {/* ORDERS */}

                        <Link
                            to="/admin/orders"
                            className="admin-action-card"
                        >

                            <div>

                                <ClipboardList
                                    size={25}
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

                            <ArrowRight size={22} />

                        </Link>


                        {/* PRODUCTS */}

                        <Link
                            to="/admin/products"
                            className="admin-action-card"
                        >

                            <div>

                                <Grid2X2
                                    size={25}
                                />

                                <h3>
                                    Manage Products
                                </h3>

                                <p>
                                    View, edit and remove
                                    products from your store.
                                </p>

                            </div>

                            <ArrowRight size={22} />

                        </Link>


                        {/* ADD PRODUCT */}

                        <Link
                            to="/admin/products/add"
                            className="admin-action-card"
                        >

                            <div>

                                <Plus size={25} />

                                <h3>
                                    Add Product
                                </h3>

                                <p>
                                    Add a new men's clothing
                                    product to BrandBlvd.
                                </p>

                            </div>

                            <ArrowRight size={22} />

                        </Link>


                        {/* COUPONS */}

                        <Link
                            to="/admin/coupons"
                            className="admin-action-card"
                        >

                            <div>

                                <TicketPercent
                                    size={25}
                                />

                                <h3>
                                    Manage Coupons
                                </h3>

                                <p>
                                    Create discount codes,
                                    manage promotions and
                                    set coupon expiry dates.
                                </p>

                            </div>

                            <ArrowRight size={22} />

                        </Link>


                        {/* CUSTOMERS */}

                        <Link
                            to="/admin/customers"
                            className="admin-action-card"
                        >

                            <div>

                                <Users size={25} />

                                <h3>
                                    Customers
                                </h3>

                                <p>
                                    View your customers and
                                    manage customer information.
                                </p>

                            </div>

                            <ArrowRight size={22} />

                        </Link>


                        {/* INVENTORY */}

                        <Link
                            to="/admin/inventory"
                            className="admin-action-card"
                        >

                            <div>

                                <BarChart3 size={25} />

                                <h3>
                                    Inventory
                                </h3>

                                <p>
                                    Monitor stock levels and
                                    identify products running low.
                                </p>

                            </div>

                            <ArrowRight size={22} />

                        </Link>

                    </div>

                </section>


                {/* =================================================
                    COUPON HIGHLIGHT
                ================================================= */}

                <section className="admin-section">

                    <div className="admin-section-header">

                        <div>
                            <span>PROMOTIONS</span>

                            <h2>
                                Coupon Management
                            </h2>
                        </div>

                        <Link
                            to="/admin/coupons"
                            className="admin-view-all"
                        >
                            Manage Coupons
                            <ArrowRight size={15} />
                        </Link>

                    </div>


                    <div className="admin-pending-orders">

                        <div className="admin-pending-icon">
                            <TicketPercent size={21} />
                        </div>

                        <div className="admin-pending-content">

                            <span>
                                DISCOUNTS & PROMOTIONS
                            </span>

                            <h3>
                                Create and manage coupon codes
                            </h3>

                            <p>
                                Offer percentage or fixed
                                discounts, minimum order values,
                                usage limits and expiry dates.
                            </p>

                        </div>

                        <Link
                            to="/admin/coupons"
                            className="admin-pending-button"
                        >
                            Manage Coupons
                            <ArrowRight size={15} />
                        </Link>

                    </div>

                </section>


                {/* =================================================
                    ORDERS
                ================================================= */}

                <section className="admin-section">

                    <div className="admin-section-header">

                        <div>
                            <span>ORDERS</span>

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


                    <div className="admin-empty">

                        <ClipboardList
                            size={28}
                        />

                        <h3>
                            Manage customer orders
                        </h3>

                        <p>
                            View orders, verify UPI payments
                            and update delivery status.
                        </p>

                        <Link
                            to="/admin/orders"
                            className="admin-empty-button"
                        >
                            Manage Orders
                            <ArrowRight size={15} />
                        </Link>

                    </div>

                </section>


                {/* =================================================
                    PRODUCTS
                ================================================= */}

                <section className="admin-section">

                    <div className="admin-section-header">

                        <div>
                            <span>INVENTORY</span>

                            <h2>
                                Product Management
                            </h2>
                        </div>

                        <Link
                            to="/admin/products"
                            className="admin-view-all"
                        >
                            View Products
                            <ArrowRight size={15} />
                        </Link>

                    </div>


                    <div className="admin-product-list">

                        <div className="admin-product-row">

                            <div className="admin-product-image">
                                <Package size={22} />
                            </div>

                            <div className="admin-product-info">

                                <strong>
                                    Product Management
                                </strong>

                                <span>
                                    Add, edit and manage your
                                    BrandBlvd products.
                                </span>

                            </div>

                            <div className="admin-product-price">
                                —
                            </div>

                            <div className="admin-stock">
                                MANAGE
                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}