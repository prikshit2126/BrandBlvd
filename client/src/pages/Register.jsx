import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
} from "lucide-react";

import api from "../services/api";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ============================================
    // INPUT HANDLER
    // ============================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    // ============================================
    // ERROR MESSAGE
    // ============================================

    const getErrorMessage = (error) => {
        const data = error.response?.data;

        if (data?.message) {
            return data.message;
        }

        if (Array.isArray(data?.errors)) {
            return data.errors
                .map((item) => item.msg || item.message)
                .filter(Boolean)
                .join(", ");
        }

        if (Array.isArray(data?.error)) {
            return data.error
                .map((item) => item.msg || item.message)
                .filter(Boolean)
                .join(", ");
        }

        if (error.response?.status === 400) {
            return "Please check your details and try again.";
        }

        if (!error.response) {
            return "Unable to connect to the server.";
        }

        return "Unable to create your account.";
    };

    // ============================================
    // SUBMIT
    // ============================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        const name = formData.name.trim();
        const email = formData.email.trim().toLowerCase();
        const phone = formData.phone.trim();
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        // Required fields
        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword
        ) {
            setError("Please fill in all fields.");
            return;
        }

        // Email
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Phone
        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(phone)) {
            setError(
                "Please enter a valid 10-digit phone number."
            );
            return;
        }

        // Password
        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        // Confirm password
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/register",
                {
                    name,
                    email,
                    phone,
                    password,
                    confirmPassword,
                }
            );

            if (!response.data?.success) {
                throw new Error(
                    response.data?.message ||
                        "Registration failed."
                );
            }

            const { token, user } = response.data;

            // Backend must return both
            if (!token || !user) {
                throw new Error(
                    "Registration succeeded but login information was not received."
                );
            }

            // ========================================
            // AUTO LOGIN
            // ========================================

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // ========================================
            // REDIRECT TO HOME
            // ========================================

            navigate("/", {
                replace: true,
            });
        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            setError(
                getErrorMessage(error)
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <main className="register-page">
            <section className="register-container">

                {/* ==================================
                    BRAND SIDE
                ================================== */}

                <div className="register-brand">

                    <Link
                        to="/"
                        className="register-logo"
                    >
                        BrandBlvd
                    </Link>

                    <div className="register-brand-content">

                        <span>
                            BRAND BLVD / JOIN
                        </span>

                        <h1>
                            Your style,
                            <br />
                            your collection.
                        </h1>

                        <p>
                            Create your BrandBlvd
                            account and discover
                            pieces made for your
                            everyday wardrobe.
                        </p>

                    </div>

                </div>

                {/* ==================================
                    REGISTER CARD
                ================================== */}

                <div className="register-card">

                    <div className="register-heading">

                        <span>
                            CREATE ACCOUNT
                        </span>

                        <h2>
                            Sign up
                        </h2>

                        <p>
                            Join BrandBlvd today.
                        </p>

                    </div>

                    {/* Error */}

                    {error && (
                        <div className="register-message error">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="register-form"
                    >

                        {/* NAME */}

                        <div className="register-field">

                            <label htmlFor="name">
                                FULL NAME
                            </label>

                            <div className="register-input">

                                <User size={17} />

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                />

                            </div>

                        </div>

                        {/* EMAIL */}

                        <div className="register-field">

                            <label htmlFor="email">
                                EMAIL ADDRESS
                            </label>

                            <div className="register-input">

                                <Mail size={17} />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                />

                            </div>

                        </div>

                        {/* PHONE */}

                        <div className="register-field">

                            <label htmlFor="phone">
                                PHONE NUMBER
                            </label>

                            <div className="register-input">

                                <Phone size={17} />

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    placeholder="10-digit mobile number"
                                    value={formData.phone}
                                    onChange={(event) => {
                                        const value =
                                            event.target.value.replace(
                                                /\D/g,
                                                ""
                                            );

                                        setFormData(
                                            (previous) => ({
                                                ...previous,
                                                phone: value,
                                            })
                                        );

                                        setError("");
                                    }}
                                    autoComplete="tel"
                                />

                            </div>

                        </div>

                        {/* PASSWORD */}

                        <div className="register-field">

                            <label htmlFor="password">
                                PASSWORD
                            </label>

                            <div className="register-input">

                                <Lock size={17} />

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) => !value
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

                        {/* CONFIRM PASSWORD */}

                        <div className="register-field">

                            <label htmlFor="confirmPassword">
                                CONFIRM PASSWORD
                            </label>

                            <div className="register-input">

                                <Lock size={17} />

                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm your password"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (value) => !value
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={17} />
                                    ) : (
                                        <Eye size={17} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="register-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                "Creating Account..."
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={17} />
                                </>
                            )}
                        </button>

                    </form>

                    {/* LOGIN */}

                    <div className="register-login">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Sign in
                            <ArrowRight size={14} />
                        </Link>

                    </div>

                </div>

            </section>
        </main>
    );
}