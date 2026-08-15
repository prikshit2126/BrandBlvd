import { useEffect, useMemo, useState } from "react";

import {
    ArrowLeft,
    Mail,
    Phone,
    Search,
    ShoppingBag,
    Users,
    User,
    RefreshCw,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import { motion } from "framer-motion";

import api from "../../services/api";

import "./Customers.css";


export default function Customers() {

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    // =====================================================
    // LOAD CUSTOMERS
    // =====================================================

    const loadCustomers = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await api.get(
                    "/users/admin/all"
                );

            if (!response.data?.success) {

                throw new Error(
                    response.data?.message ||
                    "Unable to load customers."
                );
            }

            setCustomers(
                response.data.customers || []
            );

        } catch (error) {

            console.error(
                "Failed to load customers:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to load customers."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadCustomers();

    }, []);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredCustomers = useMemo(() => {

        const value =
            search.trim().toLowerCase();

        if (!value) {
            return customers;
        }

        return customers.filter(
            (customer) =>
                customer.name
                    ?.toLowerCase()
                    .includes(value) ||

                customer.email
                    ?.toLowerCase()
                    .includes(value) ||

                customer.phone
                    ?.toLowerCase()
                    .includes(value)
        );

    }, [customers, search]);


    // =====================================================
    // STATS
    // =====================================================

    const totalOrders =
        customers.reduce(
            (total, customer) =>
                total +
                Number(customer.orderCount || 0),
            0
        );


    const totalRevenue =
        customers.reduce(
            (total, customer) =>
                total +
                Number(customer.totalSpent || 0),
            0
        );


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
    // CURRENCY
    // =====================================================

    const formatCurrency = (amount) => {

        return `₹${Number(
            amount || 0
        ).toLocaleString("en-IN")}`;

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <main className="customers-page">

            {/* =================================================
                TOPBAR
            ================================================= */}

            <header className="customers-topbar">

                <Link
                    to="/admin"
                    className="customers-logo"
                >
                    BrandBlvd
                </Link>

                <Link
                    to="/admin"
                    className="customers-back"
                >
                    <ArrowLeft size={16} />

                    Admin Dashboard
                </Link>

            </header>


            <div className="customers-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <motion.section
                    className="customers-header"
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                >

                    <div>

                        <span>
                            STORE MANAGEMENT
                        </span>

                        <h1>
                            Customers
                        </h1>

                        <p>
                            Manage your BrandBlvd
                            customer accounts.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="customers-refresh"
                        onClick={loadCustomers}
                        disabled={loading}
                    >
                        <RefreshCw
                            size={16}
                        />

                        Refresh
                    </button>

                </motion.section>


                {/* =================================================
                    STATS
                ================================================= */}

                <section className="customers-stats">

                    <div className="customer-stat">

                        <div className="customer-stat-icon">
                            <Users size={20} />
                        </div>

                        <div>

                            <span>
                                TOTAL CUSTOMERS
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : customers.length}
                            </strong>

                        </div>

                    </div>


                    <div className="customer-stat">

                        <div className="customer-stat-icon">
                            <ShoppingBag size={20} />
                        </div>

                        <div>

                            <span>
                                TOTAL ORDERS
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : totalOrders}
                            </strong>

                        </div>

                    </div>


                    <div className="customer-stat">

                        <div className="customer-stat-icon">
                            ₹
                        </div>

                        <div>

                            <span>
                                CUSTOMER REVENUE
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : formatCurrency(
                                        totalRevenue
                                    )}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <section className="customers-toolbar">

                    <div className="customers-search">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search customers by name, email or phone..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <span className="customers-count">

                        {filteredCustomers.length}
                        {" "}
                        customer
                        {filteredCustomers.length !== 1
                            ? "s"
                            : ""}

                    </span>

                </section>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="customers-error">

                        <strong>
                            Unable to load customers
                        </strong>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadCustomers}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && !error && (

                    <div className="customers-loading">

                        <div className="customers-spinner" />

                        <p>
                            Loading customers...
                        </p>

                    </div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    !error &&
                    filteredCustomers.length === 0 && (

                    <div className="customers-empty">

                        <Users size={36} />

                        <h3>
                            {search
                                ? "No customers found"
                                : "No customers yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try a different search."
                                : "Customer accounts will appear here."}
                        </p>

                    </div>

                )}


                {/* =================================================
                    TABLE
                ================================================= */}

                {!loading &&
                    !error &&
                    filteredCustomers.length > 0 && (

                    <section className="customers-table-wrapper">

                        <table className="customers-table">

                            <thead>

                                <tr>

                                    <th>
                                        CUSTOMER
                                    </th>

                                    <th>
                                        CONTACT
                                    </th>

                                    <th>
                                        ORDERS
                                    </th>

                                    <th>
                                        TOTAL SPENT
                                    </th>

                                    <th>
                                        JOINED
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredCustomers.map(
                                    (customer) => (

                                    <tr
                                        key={
                                            customer._id
                                        }
                                    >

                                        <td>

                                            <div className="customer-name">

                                                <div className="customer-avatar">

                                                    <User
                                                        size={17}
                                                    />

                                                </div>

                                                <div>

                                                    <strong>
                                                        {customer.name ||
                                                            "Unnamed Customer"}
                                                    </strong>

                                                    <span>
                                                        {customer.role ||
                                                            "customer"}
                                                    </span>

                                                </div>

                                            </div>

                                        </td>


                                        <td>

                                            <div className="customer-contact">

                                                {customer.email && (

                                                    <a
                                                        href={`mailto:${customer.email}`}
                                                    >
                                                        <Mail
                                                            size={14}
                                                        />

                                                        {customer.email}
                                                    </a>

                                                )}

                                                {customer.phone && (

                                                    <a
                                                        href={`tel:${customer.phone}`}
                                                    >
                                                        <Phone
                                                            size={14}
                                                        />

                                                        {customer.phone}
                                                    </a>

                                                )}

                                            </div>

                                        </td>


                                        <td>

                                            <span className="customer-orders">

                                                {customer.orderCount ||
                                                    0}

                                            </span>

                                        </td>


                                        <td>

                                            <strong className="customer-spent">

                                                {formatCurrency(
                                                    customer.totalSpent
                                                )}

                                            </strong>

                                        </td>


                                        <td>

                                            <span className="customer-date">

                                                {formatDate(
                                                    customer.createdAt
                                                )}

                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </section>

                )}

            </div>

        </main>
    );
}