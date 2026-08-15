import { useEffect, useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useCart } from "../../context/CartContext";

import {
    Search,
    Heart,
    ShoppingBag,
    User,
    Menu,
    X,
    ShieldCheck,
} from "lucide-react";

import "./Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const { cartCount } = useCart();

    // =====================================================
    // STATE
    // =====================================================

    const [mobileOpen, setMobileOpen] =
        useState(false);

    const [searchOpen, setSearchOpen] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [scrolled, setScrolled] =
        useState(false);

    // =====================================================
    // AUTH
    // =====================================================

    const token =
        localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const isAdmin =
        Boolean(token) &&
        user?.role === "admin";

    // =====================================================
    // PAGE
    // =====================================================

    const isHomePage =
        location.pathname === "/";

    // =====================================================
    // SCROLL
    // =====================================================

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(
                window.scrollY > 30
            );
        };

        window.addEventListener(
            "scroll",
            handleScroll
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, []);

    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = (event) => {
        event.preventDefault();

        const value =
            search.trim();

        if (!value) {
            return;
        }

        setSearchOpen(false);
        setMobileOpen(false);

        navigate(
            `/shop?search=${encodeURIComponent(
                value
            )}`
        );
    };

    // =====================================================
    // CLOSE MOBILE MENU
    // =====================================================

    const closeMobile = () => {
        setMobileOpen(false);
    };

    // =====================================================
    // CLOSE SEARCH
    // =====================================================

    const closeSearch = () => {
        setSearchOpen(false);
    };

    return (
        <>
            {/* =================================================
                HEADER
            ================================================= */}

            <header
                className={`navbar ${
                    !isHomePage
                        ? "navbar-solid"
                        : ""
                } ${
                    scrolled
                        ? "navbar-scrolled"
                        : ""
                }`}
            >

                <div className="navbar-inner">

                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <Link
                        to="/"
                        className="navbar-logo"
                        onClick={() => {
                            closeMobile();
                            closeSearch();
                        }}
                    >
                        BrandBlvd
                    </Link>


                    {/* =================================================
                        DESKTOP NAVIGATION
                    ================================================= */}

                    <nav className="desktop-nav">

                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/shop">
                            Shop
                        </Link>

                        <Link to="/shop?sort=newest">
                            New Arrivals
                        </Link>

                        <Link to="/shop?sort=bestselling">
                            Best Sellers
                        </Link>

                    </nav>


                    {/* =================================================
                        DESKTOP ACTIONS
                    ================================================= */}

                    <div className="navbar-actions">

                        {/* Search */}

                        <button
                            type="button"
                            className="nav-icon"
                            aria-label="Search"
                            onClick={() =>
                                setSearchOpen(
                                    (current) =>
                                        !current
                                )
                            }
                        >
                            <Search size={20} />
                        </button>


                        {/* Wishlist */}

                        <Link
                            to="/wishlist"
                            className="nav-icon"
                            aria-label="Wishlist"
                        >
                            <Heart size={20} />
                        </Link>


                        {/* Cart */}

                        <Link
                            to="/cart"
                            className="nav-icon cart-icon"
                            aria-label="Cart"
                        >
                            <ShoppingBag size={20} />

                            <span className="nav-count">
                                {cartCount}
                            </span>
                        </Link>


                        {/* Account */}

                        <Link
                            to={
                                token
                                    ? "/profile"
                                    : "/login"
                            }
                            className="nav-icon"
                            aria-label="Account"
                        >
                            <User size={20} />
                        </Link>


                        {/* =================================================
                            ADMIN PANEL
                            ONLY VISIBLE TO ADMINS
                        ================================================= */}

                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="nav-admin-button"
                                aria-label="Admin Panel"
                                title="Admin Panel"
                            >
                                <ShieldCheck
                                    size={17}
                                />

                                <span>
                                    Admin
                                </span>
                            </Link>
                        )}


                        {/* Mobile Menu */}

                        <button
                            type="button"
                            className="mobile-menu-button"
                            onClick={() =>
                                setMobileOpen(
                                    (current) =>
                                        !current
                                )
                            }
                            aria-label={
                                mobileOpen
                                    ? "Close menu"
                                    : "Open menu"
                            }
                        >
                            {mobileOpen ? (
                                <X size={22} />
                            ) : (
                                <Menu size={22} />
                            )}
                        </button>

                    </div>

                </div>


                {/* =================================================
                    SEARCH PANEL
                ================================================= */}

                <div
                    className={`search-panel ${
                        searchOpen
                            ? "search-panel-open"
                            : ""
                    }`}
                >

                    <form
                        onSubmit={
                            handleSearch
                        }
                    >

                        <Search size={20} />

                        <input
                            type="text"
                            placeholder="Search men's clothing..."
                            value={search}
                            onChange={(
                                event
                            ) =>
                                setSearch(
                                    event.target
                                        .value
                                )
                            }
                            autoFocus={
                                searchOpen
                            }
                        />

                        <button type="submit">
                            Search
                        </button>

                    </form>

                </div>

            </header>


            {/* =================================================
                MOBILE NAVIGATION
            ================================================= */}

            <div
                className={`mobile-nav ${
                    mobileOpen
                        ? "mobile-nav-open"
                        : ""
                }`}
            >

                <Link
                    to="/"
                    onClick={closeMobile}
                >
                    Home
                </Link>

                <Link
                    to="/shop"
                    onClick={closeMobile}
                >
                    Shop
                </Link>

                <Link
                    to="/shop?sort=newest"
                    onClick={closeMobile}
                >
                    New Arrivals
                </Link>

                <Link
                    to="/shop?sort=bestselling"
                    onClick={closeMobile}
                >
                    Best Sellers
                </Link>

                <Link
                    to="/wishlist"
                    onClick={closeMobile}
                >
                    Wishlist
                </Link>

                <Link
                    to="/cart"
                    onClick={closeMobile}
                >
                    Cart
                </Link>

                <Link
                    to={
                        token
                            ? "/profile"
                            : "/login"
                    }
                    onClick={closeMobile}
                >
                    {token
                        ? "My Profile"
                        : "Login"}
                </Link>


                {/* =================================================
                    MOBILE ADMIN PANEL
                    ONLY VISIBLE TO ADMINS
                ================================================= */}

                {isAdmin && (
                    <Link
                        to="/admin"
                        className="mobile-admin-link"
                        onClick={closeMobile}
                    >
                        <ShieldCheck
                            size={17}
                        />

                        Admin Panel
                    </Link>
                )}

            </div>
        </>
    );
}