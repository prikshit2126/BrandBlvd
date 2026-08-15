import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar/Navbar";
import { useCart } from "../context/CartContext";

import "./Cart.css";

const FALLBACK_IMAGE =
    "https://placehold.co/600x750/eeeeee/111111?text=BrandBlvd";

export default function Cart() {
    const navigate = useNavigate();

    const {
        cart,
        total,
        loading,
        updateQuantity,
        removeItem,
        clearCart,
    } = useCart();


    /* =====================================================
       DECREASE QUANTITY
    ===================================================== */

    const handleDecrease = async (item) => {
        if (item.quantity <= 1) return;

        await updateQuantity(
            item._id,
            item.quantity - 1
        );
    };


    /* =====================================================
       INCREASE QUANTITY
    ===================================================== */

    const handleIncrease = async (item) => {
        const stock = Number(
            item.product?.stock || 0
        );

        if (
            stock > 0 &&
            item.quantity >= stock
        ) {
            return;
        }

        await updateQuantity(
            item._id,
            item.quantity + 1
        );
    };


    /* =====================================================
       CHECKOUT
    ===================================================== */

    const handleCheckout = () => {
        navigate("/checkout");
    };


    /* =====================================================
       ITEM COUNT
    ===================================================== */

    const itemCount = cart.reduce(
        (sum, item) =>
            sum + Number(item.quantity || 0),
        0
    );


    /* =====================================================
       ORIGINAL TOTAL / MRP
       
       Uses:
       product.originalPrice
       
       Falls back to product.price when no
       original price has been added.
    ===================================================== */

    const originalTotal = cart.reduce(
        (sum, item) => {
            const product = item.product;

            if (!product) {
                return sum;
            }

            const quantity =
                Number(item.quantity || 0);

            const salePrice =
                Number(product.price || 0);

            const originalPrice =
                Number(
                    product.originalPrice ||
                    salePrice
                );

            return (
                sum +
                originalPrice * quantity
            );
        },
        0
    );


    /* =====================================================
       TOTAL SAVINGS
    ===================================================== */

    const totalSavings = Math.max(
        originalTotal - Number(total || 0),
        0
    );


    /* =====================================================
       DISCOUNT PERCENTAGE
    ===================================================== */

    const savingsPercentage =
        originalTotal > 0 && totalSavings > 0
            ? Math.round(
                (totalSavings / originalTotal) *
                100
            )
            : 0;


    return (
        <>
            <Navbar />

            <main className="cart-page">

                {/* =================================================
                    HEADER
                ================================================= */}

                <section className="cart-header">

                    <div>

                        <span className="cart-eyebrow">
                            BRAND BLVD / CART
                        </span>

                        <h1>Your Cart</h1>

                        <p>
                            Review your selected pieces
                            before checkout.
                        </p>

                    </div>

                    <span className="cart-item-count">
                        {itemCount}{" "}
                        {itemCount === 1
                            ? "Item"
                            : "Items"}
                    </span>

                </section>


                {/* =================================================
                    EMPTY CART
                ================================================= */}

                {cart.length === 0 ? (

                    <section className="empty-cart">

                        <div className="empty-cart-icon">
                            <ShoppingBag size={30} />
                        </div>

                        <h2>
                            Your cart is empty
                        </h2>

                        <p>
                            Looks like you haven't
                            added anything yet.
                        </p>

                        <Link
                            to="/shop"
                            className="continue-shopping"
                        >
                            Start Shopping
                        </Link>

                    </section>

                ) : (

                    <section className="cart-layout">

                        {/* =================================================
                            CART ITEMS
                        ================================================= */}

                        <div className="cart-items">

                            {cart.map(
                                (item, index) => {

                                    const product =
                                        item.product;

                                    if (!product) {
                                        return null;
                                    }


                                    const image =
                                        product.images?.[0] ||
                                        FALLBACK_IMAGE;


                                    const quantity =
                                        Number(
                                            item.quantity || 0
                                        );


                                    const price =
                                        Number(
                                            product.price || 0
                                        );


                                    const originalPrice =
                                        Number(
                                            product.originalPrice ||
                                            price
                                        );


                                    const itemTotal =
                                        price *
                                        quantity;


                                    const itemSavings =
                                        Math.max(
                                            (
                                                originalPrice -
                                                price
                                            ) * quantity,
                                            0
                                        );


                                    return (
                                        <motion.article
                                            key={item._id}
                                            className="cart-item"

                                            initial={{
                                                opacity: 0,
                                                y: 15,
                                            }}

                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}

                                            transition={{
                                                delay:
                                                    index * 0.05,
                                            }}
                                        >

                                            {/* =================================
                                                IMAGE
                                            ================================= */}

                                            <Link
                                                to={`/product/${product._id}`}
                                                className="cart-item-image"
                                            >

                                                <img
                                                    src={image}
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

                                            </Link>


                                            {/* =================================
                                                PRODUCT INFO
                                            ================================= */}

                                            <div className="cart-item-info">

                                                <div className="cart-item-heading">

                                                    <div>

                                                        <span>
                                                            {product.brand ||
                                                                "BrandBlvd"}
                                                        </span>

                                                        <Link
                                                            to={`/product/${product._id}`}
                                                        >
                                                            {product.name}
                                                        </Link>

                                                    </div>


                                                    <button
                                                        type="button"
                                                        className="remove-item"

                                                        onClick={() =>
                                                            removeItem(
                                                                item._id
                                                            )
                                                        }

                                                        disabled={loading}

                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2
                                                            size={17}
                                                        />
                                                    </button>

                                                </div>


                                                {/* =================================
                                                    PRICE
                                                ================================= */}

                                                <div className="cart-item-price">

                                                    <strong>
                                                        ₹
                                                        {itemTotal.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>


                                                    {originalPrice >
                                                        price && (
                                                        <span className="cart-original-price">
                                                            ₹
                                                            {(
                                                                originalPrice *
                                                                quantity
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </span>
                                                    )}


                                                    {itemSavings >
                                                        0 && (
                                                        <span className="cart-item-saving">
                                                            You save ₹
                                                            {itemSavings.toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </span>
                                                    )}

                                                </div>


                                                {/* =================================
                                                    BOTTOM
                                                ================================= */}

                                                <div className="cart-item-bottom">

                                                    <div className="quantity-control">

                                                        <button
                                                            type="button"

                                                            onClick={() =>
                                                                handleDecrease(
                                                                    item
                                                                )
                                                            }

                                                            disabled={
                                                                loading ||
                                                                quantity <= 1
                                                            }

                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus
                                                                size={14}
                                                            />
                                                        </button>


                                                        <span>
                                                            {quantity}
                                                        </span>


                                                        <button
                                                            type="button"

                                                            onClick={() =>
                                                                handleIncrease(
                                                                    item
                                                                )
                                                            }

                                                            disabled={
                                                                loading ||
                                                                (
                                                                    product.stock >
                                                                        0 &&
                                                                    quantity >=
                                                                        product.stock
                                                                )
                                                            }

                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus
                                                                size={14}
                                                            />
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        </motion.article>
                                    );
                                }
                            )}


                            {/* =============================================
                                CLEAR CART
                            ============================================= */}

                            <button
                                type="button"
                                className="clear-cart"

                                onClick={clearCart}

                                disabled={loading}
                            >
                                <Trash2 size={15} />

                                Clear Cart
                            </button>

                        </div>


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <aside className="cart-summary">

                            <div className="summary-card">

                                <span className="summary-label">
                                    ORDER SUMMARY
                                </span>


                                <h2>
                                    Summary
                                </h2>


                                {/* =========================================
                                    SALE SUBTOTAL
                                ========================================= */}

                                <div className="summary-row">

                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            total
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>


                                {/* =========================================
                                    ORIGINAL PRICE
                                ========================================= */}

                                {originalTotal >
                                    Number(total || 0) && (

                                    <div className="summary-row original-summary-row">

                                        <span>
                                            MRP
                                        </span>

                                        <strong>
                                            ₹
                                            {originalTotal.toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>

                                )}


                                {/* =========================================
                                    YOU SAVED
                                ========================================= */}

                                {totalSavings >
                                    0 && (

                                    <div className="cart-you-saved">

                                        <div>

                                            <span>
                                                YOU SAVED
                                            </span>

                                            {savingsPercentage >
                                                0 && (
                                                <small>
                                                    {savingsPercentage}%
                                                    OFF
                                                </small>
                                            )}

                                        </div>

                                        <strong>
                                            ₹
                                            {totalSavings.toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>

                                )}


                                {/* =========================================
                                    SHIPPING
                                ========================================= */}

                                <div className="summary-row">

                                    <span>
                                        Shipping
                                    </span>

                                    <strong>
                                        {Number(total || 0) >=
                                            2000
                                            ? "FREE"
                                            : "Calculated at checkout"}
                                    </strong>

                                </div>


                                <div className="summary-divider" />


                                {/* =========================================
                                    TOTAL
                                ========================================= */}

                                <div className="summary-total">

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            total
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>


                                {/* =========================================
                                    CHECKOUT
                                ========================================= */}

                                <button
                                    type="button"
                                    className="checkout-button"

                                    onClick={
                                        handleCheckout
                                    }

                                    disabled={loading}
                                >
                                    Proceed to Checkout
                                </button>


                                {/* =========================================
                                    CONTINUE SHOPPING
                                ========================================= */}

                                <Link
                                    to="/shop"
                                    className="back-shopping"
                                >
                                    <ArrowLeft
                                        size={15}
                                    />

                                    Continue Shopping
                                </Link>

                            </div>


                            {/* =============================================
                                SECURITY NOTE
                            ============================================= */}

                            <div className="cart-note">

                                <strong>
                                    Secure Shopping
                                </strong>

                                <p>
                                    Your order details and
                                    payment information are
                                    securely handled.
                                </p>

                            </div>

                        </aside>

                    </section>
                )}

            </main>
        </>
    );
}