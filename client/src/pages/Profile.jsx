import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Phone,
    Package,
    Heart,
    LogOut,
    ArrowRight,
    ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar/Navbar";

import "./Profile.css";

export default function Profile() {
    const navigate = useNavigate();

    const [user] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem("user") || "null"
            );
        } catch {
            return null;
        }
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
            replace: true,
        });
    };

    if (!user) {
        return (
            <>
                <Navbar />

                <main className="profile-page">
                    <div className="profile-login-required">
                        <User size={35} />

                        <h1>Login Required</h1>

                        <p>
                            Please login to view your
                            profile.
                        </p>

                        <Link to="/login">
                            Login
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="profile-page">

                {/* Header */}

                <motion.section
                    className="profile-header"
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
                        <span className="profile-eyebrow">
                            BRAND BLVD / ACCOUNT
                        </span>

                        <h1>My Profile</h1>

                        <p>
                            Manage your account and
                            view your shopping activity.
                        </p>
                    </div>
                </motion.section>


                {/* Main layout */}

                <section className="profile-layout">

                    {/* ==========================
                        PROFILE CARD
                    ========================== */}

                    <motion.div
                        className="profile-card profile-main-card"
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1,
                        }}
                    >

                        <div className="profile-card-heading">
                            <div className="profile-avatar">
                                {user.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </div>

                            <div>
                                <span>
                                    ACCOUNT
                                </span>

                                <h2>
                                    {user.name ||
                                        "Customer"}
                                </h2>

                                {user.role ===
                                    "admin" && (
                                    <div className="profile-admin-badge">
                                        <ShieldCheck
                                            size={13}
                                        />
                                        Administrator
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Details */}

                        <div className="profile-details">

                            <div className="profile-detail">

                                <div className="profile-detail-icon">
                                    <User size={18} />
                                </div>

                                <div>
                                    <span>
                                        FULL NAME
                                    </span>

                                    <strong>
                                        {user.name ||
                                            "Not provided"}
                                    </strong>
                                </div>

                            </div>


                            <div className="profile-detail">

                                <div className="profile-detail-icon">
                                    <Mail size={18} />
                                </div>

                                <div>
                                    <span>
                                        EMAIL ADDRESS
                                    </span>

                                    <strong>
                                        {user.email ||
                                            "Not provided"}
                                    </strong>
                                </div>

                            </div>


                            <div className="profile-detail">

                                <div className="profile-detail-icon">
                                    <Phone size={18} />
                                </div>

                                <div>
                                    <span>
                                        PHONE NUMBER
                                    </span>

                                    <strong>
                                        {user.phone ||
                                            "Not provided"}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    </motion.div>


                    {/* ==========================
                        QUICK LINKS
                    ========================== */}

                    <motion.div
                        className="profile-side"
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 0.2,
                        }}
                    >

                        <div className="profile-card">

                            <div className="profile-side-heading">
                                <span>
                                    QUICK ACCESS
                                </span>

                                <h2>
                                    Your Account
                                </h2>
                            </div>


                            <div className="profile-links">

                                <Link
                                    to="/orders"
                                    className="profile-link"
                                >
                                    <div>
                                        <Package
                                            size={19}
                                        />

                                        <div>
                                            <strong>
                                                My Orders
                                            </strong>

                                            <span>
                                                Track your
                                                purchases
                                            </span>
                                        </div>
                                    </div>

                                    <ArrowRight
                                        size={17}
                                    />
                                </Link>


                                <Link
                                    to="/wishlist"
                                    className="profile-link"
                                >
                                    <div>
                                        <Heart
                                            size={19}
                                        />

                                        <div>
                                            <strong>
                                                Wishlist
                                            </strong>

                                            <span>
                                                Your saved
                                                products
                                            </span>
                                        </div>
                                    </div>

                                    <ArrowRight
                                        size={17}
                                    />
                                </Link>


                                <Link
                                    to="/shop"
                                    className="profile-link"
                                >
                                    <div>
                                        <Package
                                            size={19}
                                        />

                                        <div>
                                            <strong>
                                                Continue
                                                Shopping
                                            </strong>

                                            <span>
                                                Explore the
                                                collection
                                            </span>
                                        </div>
                                    </div>

                                    <ArrowRight
                                        size={17}
                                    />
                                </Link>

                            </div>

                        </div>


                        {/* Logout */}

                        <button
                            type="button"
                            className="profile-logout"
                            onClick={handleLogout}
                        >
                            <LogOut size={17} />

                            <span>
                                Sign Out
                            </span>
                        </button>

                    </motion.div>

                </section>

            </main>
        </>
    );
}