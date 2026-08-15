import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Check,
    Lock,
    ShoppingBag,
    Smartphone,
    Tag,
    X,
} from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar/Navbar";
import { useCart } from "../context/CartContext";
import orderService from "../services/orderService";
import couponService from "../services/couponService";

import upiQr from "../assets/payment/upi.png";

import "./Checkout.css";

export default function Checkout() {
    const navigate = useNavigate();

    const {
        cart,
        total,
        loading: cartLoading,
    } = useCart();

    /* =====================================================
       STATE
    ===================================================== */

    const [placingOrder, setPlacingOrder] =
        useState(false);

    const [error, setError] =
        useState("");

    const [couponInput, setCouponInput] =
        useState("");

    const [appliedCoupon, setAppliedCoupon] =
        useState(null);

    const [couponMessage, setCouponMessage] =
        useState("");

    const [couponLoading, setCouponLoading] =
        useState(false);

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        paymentMethod: "COD",
        paymentReference: "",
    });

    /* =====================================================
       SALE CALCULATIONS
    ===================================================== */

    const calculateItemPricing = (item) => {
        const product = item?.product;

        if (!product) {
            return {
                quantity: 0,
                saleTotal: 0,
                originalTotal: 0,
                saved: 0,
            };
        }

        const quantity =
            Number(item.quantity) || 0;

        const salePrice =
            Number(product.price) || 0;

        const originalPrice =
            Number(
                product.originalPrice ??
                    product.compareAtPrice ??
                    product.comparePrice ??
                    product.mrp ??
                    salePrice
            );

        const validOriginalPrice =
            originalPrice > salePrice
                ? originalPrice
                : salePrice;

        const saleTotal =
            salePrice * quantity;

        const originalTotal =
            validOriginalPrice * quantity;

        const saved = Math.max(
            originalTotal - saleTotal,
            0
        );

        return {
            quantity,
            saleTotal,
            originalTotal,
            saved,
        };
    };

    /* =====================================================
       ORDER PRICING
    ===================================================== */

    const pricing = cart.reduce(
        (result, item) => {
            const itemPricing =
                calculateItemPricing(item);

            result.saleTotal +=
                itemPricing.saleTotal;

            result.originalTotal +=
                itemPricing.originalTotal;

            result.saleSavings +=
                itemPricing.saved;

            return result;
        },
        {
            saleTotal: 0,
            originalTotal: 0,
            saleSavings: 0,
        }
    );

    /*
        CartContext total should normally match
        the selling-price total.

        Use the calculated value for the
        checkout breakdown.
    */

    const subtotal =
        Number(total) ||
        pricing.saleTotal;

    /* =====================================================
       COUPON DISCOUNT
    ===================================================== */

    /*
        IMPORTANT:

        The coupon discount now comes directly
        from the backend.

        This means:
        - percentage discounts
        - fixed discounts
        - max discount
        - minimum order value
        - expiry
        - active/inactive status
        - usage limits

        are all controlled by the backend.
    */

    const couponDiscount =
        Number(
            appliedCoupon?.discount || 0
        );

    /* =====================================================
       SHIPPING
    ===================================================== */

    const shipping =
        subtotal >= 2000
            ? 0
            : 0;

    /* =====================================================
       FINAL TOTAL
    ===================================================== */

    const finalTotal = Math.max(
        subtotal -
            couponDiscount +
            shipping,
        0
    );

    /* =====================================================
       TOTAL SAVINGS
    ===================================================== */

    const totalSaved =
        pricing.saleSavings +
        couponDiscount;

    /* =====================================================
       FORM CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        let newValue = value;

        if (name === "phone") {
            newValue = value
                .replace(/\D/g, "")
                .slice(0, 10);
        }

        if (name === "pincode") {
            newValue = value
                .replace(/\D/g, "")
                .slice(0, 6);
        }

        setForm((current) => ({
            ...current,
            [name]: newValue,
        }));

        setError("");
    };

    /* =====================================================
       APPLY COUPON
    ===================================================== */

    const handleApplyCoupon = async () => {
        const code = couponInput
            .trim()
            .toUpperCase();

        setCouponMessage("");

        if (!code) {
            setCouponMessage(
                "Please enter a coupon code."
            );
            return;
        }

        if (couponLoading) {
            return;
        }

        try {
            setCouponLoading(true);
            setError("");

            const response =
                await couponService.validateCoupon(
                    code,
                    subtotal
                );

            const data = response?.data;

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                        "Invalid coupon code."
                );
            }

            const discount =
                Number(data.discount) || 0;

            setAppliedCoupon({
                code:
                    data.coupon?.code ||
                    code,

                type:
                    data.coupon?.discountType ||
                    "percentage",

                value:
                    Number(
                        data.coupon?.discountValue
                    ) || 0,

                discount,
            });

            setCouponInput(
                data.coupon?.code ||
                    code
            );

            setCouponMessage(
                `${data.coupon?.code || code} applied successfully. You saved ₹${discount.toLocaleString(
                    "en-IN"
                )}.`
            );
        } catch (err) {
            console.error(
                "Coupon validation failed:",
                err
            );

            setAppliedCoupon(null);

            setCouponMessage(
                err.response?.data?.message ||
                    err.message ||
                    "Invalid coupon code."
            );
        } finally {
            setCouponLoading(false);
        }
    };

    /* =====================================================
       REMOVE COUPON
    ===================================================== */

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput("");
        setCouponMessage("");
        setError("");
    };

    /* =====================================================
       PLACE ORDER
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (placingOrder) {
            return;
        }

        setError("");

        if (!cart.length) {
            setError(
                "Your cart is empty."
            );
            return;
        }

        /* -------------------------------------------------
           SHIPPING VALIDATION
        ------------------------------------------------- */

        const fullName =
            form.fullName.trim();

        const phone =
            form.phone.trim();

        const address =
            form.address.trim();

        const city =
            form.city.trim();

        const state =
            form.state.trim();

        const pincode =
            form.pincode.trim();

        if (
            !fullName ||
            !phone ||
            !address ||
            !city ||
            !state ||
            !pincode
        ) {
            setError(
                "Please complete all shipping details."
            );
            return;
        }

        if (
            !/^[6-9]\d{9}$/.test(phone)
        ) {
            setError(
                "Please enter a valid 10-digit Indian mobile number."
            );
            return;
        }

        if (
            !/^\d{6}$/.test(pincode)
        ) {
            setError(
                "Please enter a valid 6-digit pincode."
            );
            return;
        }

        /* -------------------------------------------------
           UPI VALIDATION
        ------------------------------------------------- */

        if (
            form.paymentMethod === "UPI" &&
            !form.paymentReference.trim()
        ) {
            setError(
                "Please complete the UPI payment and enter your transaction reference."
            );
            return;
        }

        try {
            setPlacingOrder(true);

            const shippingAddress = {
                fullName,
                phone,
                address,
                city,
                state,
                pincode,
            };

            /* -------------------------------------------------
               ORDER REQUEST
            ------------------------------------------------- */

            const response =
                await orderService.placeOrder({
                    shippingAddress,

                    paymentMethod:
                        form.paymentMethod,

                    paymentReference:
                        form.paymentMethod ===
                        "UPI"
                            ? form.paymentReference.trim()
                            : "",

                    couponCode:
                        appliedCoupon?.code ||
                        "",

                    couponDiscount,

                    saleDiscount:
                        pricing.saleSavings,

                    totalSavings:
                        totalSaved,

                    checkoutTotal:
                        finalTotal,
                });

            const data =
                response?.data;

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                        "Unable to place order"
                );
            }

            /* -------------------------------------------------
               REDIRECT
            ------------------------------------------------- */

            const order =
                data.order;

            const orderReference =
                order?.orderId ||
                order?._id;

            if (orderReference) {
                navigate(
                    `/orders?success=true&order=${encodeURIComponent(
                        orderReference
                    )}`,
                    {
                        replace: true,
                    }
                );
            } else {
                navigate(
                    "/orders?success=true",
                    {
                        replace: true,
                    }
                );
            }
        } catch (err) {
            console.error(
                "Order placement failed:",
                err
            );

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to place your order."
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    /* =====================================================
       LOGIN CHECK
    ===================================================== */

    if (!localStorage.getItem("token")) {
        return (
            <>
                <Navbar />

                <main className="checkout-page">
                    <div className="checkout-login">
                        <div className="checkout-login-icon">
                            <Lock size={25} />
                        </div>

                        <h1>
                            Login Required
                        </h1>

                        <p>
                            Please login to continue
                            with your purchase.
                        </p>

                        <Link to="/login">
                            Login to Continue
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    /* =====================================================
       EMPTY CART
    ===================================================== */

    if (
        !cartLoading &&
        cart.length === 0
    ) {
        return (
            <>
                <Navbar />

                <main className="checkout-page">
                    <div className="checkout-login">
                        <div className="checkout-login-icon">
                            <ShoppingBag size={25} />
                        </div>

                        <h1>
                            Your Cart is Empty
                        </h1>

                        <p>
                            Add some products before
                            proceeding to checkout.
                        </p>

                        <Link to="/shop">
                            Continue Shopping
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    /* =====================================================
       CHECKOUT
    ===================================================== */

    return (
        <>
            <Navbar />

            <main className="checkout-page">

                {/* =================================================
                    HEADER
                ================================================= */}

                <section className="checkout-header">
                    <div>
                        <span>
                            BRAND BLVD / CHECKOUT
                        </span>

                        <h1>
                            Checkout
                        </h1>

                        <p>
                            Complete your details
                            and place your order.
                        </p>
                    </div>

                    <div className="secure-checkout">
                        <Lock size={15} />
                        Secure Checkout
                    </div>
                </section>

                <form
                    className="checkout-layout"
                    onSubmit={handleSubmit}
                >

                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <div className="checkout-form">

                        {/* =================================================
                            SHIPPING
                        ================================================= */}

                        <section className="checkout-card">

                            <div className="checkout-card-heading">

                                <div className="step-number">
                                    01
                                </div>

                                <div>
                                    <span>
                                        DELIVERY
                                    </span>

                                    <h2>
                                        Shipping Address
                                    </h2>
                                </div>

                            </div>

                            <div className="form-grid">

                                <div className="form-field full">
                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        value={
                                            form.fullName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Your full name"
                                        autoComplete="name"
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label>
                                        Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={
                                            form.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="10-digit mobile number"
                                        inputMode="numeric"
                                        autoComplete="tel"
                                        maxLength={10}
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label>
                                        Pincode
                                    </label>

                                    <input
                                        type="text"
                                        name="pincode"
                                        value={
                                            form.pincode
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. 147001"
                                        inputMode="numeric"
                                        autoComplete="postal-code"
                                        maxLength={6}
                                        required
                                    />
                                </div>

                                <div className="form-field full">
                                    <label>
                                        Address
                                    </label>

                                    <textarea
                                        name="address"
                                        value={
                                            form.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="House / Flat / Street / Area"
                                        rows={4}
                                        autoComplete="street-address"
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label>
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={
                                            form.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="City"
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label>
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={
                                            form.state
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="State"
                                        required
                                    />
                                </div>

                            </div>
                        </section>

                        {/* =================================================
                            PAYMENT
                        ================================================= */}

                        <section className="checkout-card">

                            <div className="checkout-card-heading">

                                <div className="step-number">
                                    02
                                </div>

                                <div>
                                    <span>
                                        PAYMENT
                                    </span>

                                    <h2>
                                        Payment Method
                                    </h2>
                                </div>

                            </div>

                            {/* COD */}

                            <label
                                className={`payment-option ${
                                    form.paymentMethod ===
                                    "COD"
                                        ? "selected"
                                        : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={
                                        form.paymentMethod ===
                                        "COD"
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <div className="payment-radio">
                                    {form.paymentMethod ===
                                        "COD" && (
                                        <Check size={13} />
                                    )}
                                </div>

                                <div>
                                    <strong>
                                        Cash on Delivery
                                    </strong>

                                    <span>
                                        Pay when your
                                        order arrives.
                                    </span>
                                </div>
                            </label>

                            {/* UPI */}

                            <label
                                className={`payment-option ${
                                    form.paymentMethod ===
                                    "UPI"
                                        ? "selected"
                                        : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="UPI"
                                    checked={
                                        form.paymentMethod ===
                                        "UPI"
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <div className="payment-radio">
                                    {form.paymentMethod ===
                                        "UPI" && (
                                        <Check size={13} />
                                    )}
                                </div>

                                <div>
                                    <strong>
                                        UPI Payment
                                    </strong>

                                    <span>
                                        Pay using Google Pay,
                                        PhonePe, Paytm or
                                        another UPI app.
                                    </span>
                                </div>
                            </label>

                            {/* UPI DETAILS */}

                            {form.paymentMethod ===
                                "UPI" && (
                                <div className="upi-payment-box">

                                    <div className="upi-payment-header">

                                        <Smartphone size={20} />

                                        <div>
                                            <strong>
                                                Pay using UPI
                                            </strong>

                                            <span>
                                                Scan the QR code
                                                using any UPI
                                                application.
                                            </span>
                                        </div>

                                    </div>

                                    <div className="upi-qr-wrapper">
                                        <img
                                            src={upiQr}
                                            alt="BrandBlvd UPI QR Code"
                                            className="upi-qr"
                                        />
                                    </div>

                                    <div className="upi-id-box">
                                        <span>
                                            UPI ID
                                        </span>

                                        <strong>
                                            YOUR-UPI-ID@upi
                                        </strong>
                                    </div>

                                    <div className="upi-instructions">
                                        <strong>
                                            How to pay
                                        </strong>

                                        <ol>
                                            <li>
                                                Scan the QR
                                                code using
                                                your UPI app.
                                            </li>

                                            <li>
                                                Pay the exact
                                                order amount.
                                            </li>

                                            <li>
                                                Copy your UPI
                                                transaction
                                                reference.
                                            </li>

                                            <li>
                                                Enter the
                                                reference below.
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="form-field">
                                        <label>
                                            UPI TRANSACTION REFERENCE
                                        </label>

                                        <input
                                            type="text"
                                            name="paymentReference"
                                            value={
                                                form.paymentReference
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter UPI transaction ID"
                                            autoComplete="off"
                                            required
                                        />
                                    </div>

                                </div>
                            )}

                        </section>

                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (
                            <motion.div
                                className="checkout-error"
                                initial={{
                                    opacity: 0,
                                    y: -5,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="button"
                            className="mobile-back"
                            onClick={() =>
                                navigate("/cart")
                            }
                        >
                            <ArrowLeft size={15} />
                            Back to Cart
                        </button>

                    </div>

                    {/* =================================================
                        RIGHT SUMMARY
                    ================================================= */}

                    <aside className="checkout-summary">

                        <div className="checkout-summary-card">

                            <span className="summary-eyebrow">
                                ORDER SUMMARY
                            </span>

                            <h2>
                                Your Order
                            </h2>

                            {/* =================================================
                                ITEMS
                            ================================================= */}

                            <div className="checkout-items">

                                {cart.map((item) => {
                                    if (
                                        !item.product
                                    ) {
                                        return null;
                                    }

                                    const image =
                                        item.product
                                            .images?.[0];

                                    const itemPricing =
                                        calculateItemPricing(
                                            item
                                        );

                                    return (
                                        <div
                                            className="checkout-item"
                                            key={item._id}
                                        >

                                            <div className="checkout-item-image">

                                                {image ? (
                                                    <img
                                                        src={
                                                            image
                                                        }
                                                        alt={
                                                            item
                                                                .product
                                                                .name
                                                        }
                                                    />
                                                ) : (
                                                    <div>
                                                        BB
                                                    </div>
                                                )}

                                                <span>
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                            </div>

                                            <div className="checkout-item-info">

                                                <strong>
                                                    {
                                                        item
                                                            .product
                                                            .name
                                                    }
                                                </strong>

                                                <span>
                                                    ₹
                                                    {itemPricing.saleTotal.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </span>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>

                            {/* =================================================
                                MRP / ORIGINAL PRICE
                            ================================================= */}

                            {pricing.originalTotal >
                                subtotal && (
                                <div className="summary-line">

                                    <span>
                                        Price
                                    </span>

                                    <strong>
                                        ₹
                                        {pricing.originalTotal.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>
                            )}

                            {/* =================================================
                                SALE PRICE
                            ================================================= */}

                            <div className="summary-line sale-summary-line">

                                <span>
                                    Sale Price
                                </span>

                                <strong>
                                    -₹
                                    {pricing.saleSavings.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>

                            {/* =================================================
                                SUBTOTAL
                            ================================================= */}

                            <div className="summary-line">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {subtotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>

                            {/* =================================================
                                COUPON
                            ================================================= */}

                            <div className="checkout-coupon">

                                <div className="coupon-heading">
                                    <Tag size={15} />

                                    <span>
                                        Have a coupon?
                                    </span>
                                </div>

                                <div className="coupon-input-row">

                                    <input
                                        type="text"
                                        value={
                                            couponInput
                                        }
                                        onChange={(event) => {
                                            setCouponInput(
                                                event.target.value
                                            );

                                            setCouponMessage(
                                                ""
                                            );
                                        }}
                                        placeholder="Enter coupon code"
                                        disabled={
                                            !!appliedCoupon ||
                                            couponLoading
                                        }
                                    />

                                    {appliedCoupon ? (
                                        <button
                                            type="button"
                                            className="coupon-remove"
                                            onClick={
                                                handleRemoveCoupon
                                            }
                                            disabled={
                                                couponLoading
                                            }
                                        >
                                            <X size={15} />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="coupon-apply"
                                            onClick={
                                                handleApplyCoupon
                                            }
                                            disabled={
                                                couponLoading ||
                                                !couponInput.trim()
                                            }
                                        >
                                            {couponLoading
                                                ? "Checking..."
                                                : "Apply"}
                                        </button>
                                    )}

                                </div>

                                {couponMessage && (
                                    <p
                                        className={
                                            appliedCoupon
                                                ? "coupon-success"
                                                : "coupon-error"
                                        }
                                    >
                                        {couponMessage}
                                    </p>
                                )}

                                {!appliedCoupon && (
                                    <small className="coupon-hint">
                                        Enter a valid active coupon code.
                                    </small>
                                )}

                            </div>

                            {/* =================================================
                                COUPON DISCOUNT
                            ================================================= */}

                            {couponDiscount > 0 && (
                                <div className="summary-line coupon-discount">

                                    <span>
                                        Coupon
                                    </span>

                                    <strong>
                                        -₹
                                        {couponDiscount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>
                            )}

                            {/* =================================================
                                SHIPPING
                            ================================================= */}

                            <div className="summary-line">

                                <span>
                                    Shipping
                                </span>

                                <strong>
                                    {shipping === 0
                                        ? "FREE"
                                        : `₹${shipping.toLocaleString(
                                              "en-IN"
                                          )}`}
                                </strong>

                            </div>

                            {/* =================================================
                                SAVINGS
                            ================================================= */}

                            {totalSaved > 0 && (
                                <div className="you-saved">

                                    <span>
                                        YOU SAVED
                                    </span>

                                    <strong>
                                        ₹
                                        {totalSaved.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>
                            )}

                            <div className="summary-divider" />

                            {/* =================================================
                                TOTAL
                            ================================================= */}

                            <div className="checkout-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹
                                    {finalTotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>

                            <button
                                type="submit"
                                className="place-order-button"
                                disabled={
                                    placingOrder ||
                                    cartLoading ||
                                    cart.length === 0
                                }
                            >
                                {placingOrder
                                    ? "Placing Order..."
                                    : form.paymentMethod ===
                                      "UPI"
                                    ? "Confirm UPI Order"
                                    : "Place Order"}
                            </button>

                            <p className="checkout-terms">
                                By placing your order,
                                you agree to BrandBlvd's
                                terms and conditions.
                            </p>

                        </div>

                    </aside>

                </form>

            </main>
        </>
    );
}