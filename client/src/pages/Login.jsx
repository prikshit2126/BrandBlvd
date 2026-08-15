import { useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Eye,
    EyeOff,
    ShieldCheck,
} from "lucide-react";

import api from "../services/api";
import "./Login.css";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Page user originally wanted to visit
    const from =
        location.state?.from || "/";

    // ============================================
    // LOGIN
    // ============================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        const cleanEmail =
            email.trim().toLowerCase();

        if (!cleanEmail || !password) {
            setError(
                "Please enter your email and password."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/login",
                {
                    email: cleanEmail,
                    password,
                }
            );

            const data = response.data;

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                        "Login failed."
                );
            }

            if (!data.token || !data.user) {
                throw new Error(
                    "Login information was not received."
                );
            }

            // ========================================
            // SAVE AUTHENTICATION
            // ========================================

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // ========================================
            // ADMIN REDIRECT
            // ========================================

            if (data.user.role === "admin") {
                navigate("/admin", {
                    replace: true,
                });

                return;
            }

            // ========================================
            // CUSTOMER REDIRECT
            // ========================================

            navigate(from, {
                replace: true,
            });

        } catch (err) {
            console.error(
                "Login error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <main className="login-page">

            <motion.div
                className="login-card"
                initial={{
                    opacity: 0,
                    y: 30,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.5,
                }}
            >

                {/* BRAND */}

                <Link
                    to="/"
                    className="login-brand"
                >
                    BrandBlvd
                </Link>

                {/* HEADING */}

                <div className="login-heading">

                    <span>
                        WELCOME BACK
                    </span>

                    <h1>
                        Sign in.
                    </h1>

                    <p>
                        Access your BrandBlvd
                        collection.
                    </p>

                </div>

                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="login-form"
                >

                    {/* EMAIL */}

                    <div className="login-field">

                        <label htmlFor="login-email">
                            Email Address
                        </label>

                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(event) => {
                                setEmail(
                                    event.target.value
                                );
                                setError("");
                            }}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />

                    </div>

                    {/* PASSWORD */}

                    <div className="login-field">

                        <label htmlFor="login-password">
                            Password
                        </label>

                        <div className="login-password-wrapper">

                            <input
                                id="login-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(event) => {
                                    setPassword(
                                        event.target.value
                                    );
                                    setError("");
                                }}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        (value) =>
                                            !value
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>

                        </div>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            "Signing in..."
                        ) : (
                            <>
                                Sign In
                                <ArrowRight
                                    size={18}
                                />
                            </>
                        )}
                    </button>

                </form>

                {/* REGISTER */}

                <div className="login-register">

                    <span>
                        Don't have an account?
                    </span>

                    <Link
                        to="/register"
                        state={{
                            from,
                        }}
                    >
                        Create Account
                    </Link>

                </div>

                {/* ADMIN */}

                <div className="admin-login-link">

                    <ShieldCheck size={15} />

                    <span>
                        Store administrator?
                    </span>

                    <Link to="/admin/login">
                        Admin Login
                    </Link>

                </div>

            </motion.div>

        </main>
    );
}