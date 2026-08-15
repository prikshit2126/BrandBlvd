import { Link } from "react-router-dom";
import {
    Heart,
    ShoppingBag,
    Star,
} from "lucide-react";
import { motion } from "framer-motion";

import "./ProductCard.css";

const FALLBACK_IMAGE =
    "https://placehold.co/600x800/111111/ffffff?text=BrandBlvd";

export default function ProductCard({ product }) {
    if (!product) {
        return null;
    }

    /* =====================================================
       IMAGE
    ===================================================== */

    const image =
        product.images?.length > 0
            ? product.images[0]
            : FALLBACK_IMAGE;


    /* =====================================================
       PRICE
    ===================================================== */

    const sellingPrice = Number(product.price || 0);

    const comparePrice = Number(
        product.originalPrice ??
        product.compareAtPrice ??
        product.comparePrice ??
        product.mrp ??
        0
    );

    const isOnSale =
        comparePrice > sellingPrice &&
        sellingPrice > 0;


    /* =====================================================
       DISCOUNT
    ===================================================== */

    const discountPercentage = isOnSale
        ? Math.round(
            ((comparePrice - sellingPrice) / comparePrice) * 100
        )
        : 0;


    /* =====================================================
       RATING
    ===================================================== */

    const rating = Number(
        product.rating ??
        product.ratings ??
        0
    );


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <motion.article
            className="product-card"

            initial={{
                opacity: 0,
                y: 30,
            }}

            whileInView={{
                opacity: 1,
                y: 0,
            }}

            viewport={{
                once: true,
                amount: 0.15,
            }}

            whileHover={{
                y: -6,
            }}

            transition={{
                duration: 0.35,
            }}
        >

            {/* =================================================
               IMAGE
            ================================================= */}

            <div className="product-image-wrapper">

                <Link to={`/product/${product._id}`}>
                    <img
                        src={image}
                        alt={
                            product.name ||
                            "BrandBlvd product"
                        }
                        className="product-image"

                        onError={(event) => {
                            event.currentTarget.src =
                                FALLBACK_IMAGE;
                        }}
                    />
                </Link>


                {/* SALE BADGE */}

                {isOnSale && (
                    <span className="product-badge">
                        {discountPercentage}% OFF
                    </span>
                )}


                {/* OUT OF STOCK */}

                {product.stock === 0 && (
                    <span className="out-of-stock">
                        Out of Stock
                    </span>
                )}


                {/* WISHLIST */}

                <button
                    type="button"
                    className="wishlist-button"
                    aria-label="Add to wishlist"
                >
                    <Heart size={19} />
                </button>


                {/* QUICK CART */}

                <button
                    type="button"
                    className="quick-cart"
                    disabled={product.stock === 0}
                >
                    <ShoppingBag size={17} />
                    <span>Add to Cart</span>
                </button>

            </div>


            {/* =================================================
               PRODUCT INFORMATION
            ================================================= */}

            <div className="product-info">

                {/* BRAND */}

                <p className="product-brand">
                    {product.brand || "BrandBlvd"}
                </p>


                {/* NAME */}

                <Link
                    to={`/product/${product._id}`}
                    className="product-name"
                >
                    {product.name}
                </Link>


                {/* =================================================
                   RATING
                ================================================= */}

                <div className="product-rating">

                    <div className="stars">

                        {Array.from({
                            length: 5,
                        }).map((_, index) => (
                            <Star
                                key={index}
                                size={14}
                                fill={
                                    index <
                                    Math.round(rating)
                                        ? "currentColor"
                                        : "none"
                                }
                            />
                        ))}

                    </div>

                    <span>
                        ({product.numReviews || 0})
                    </span>

                </div>


                {/* =================================================
                   PRICE SECTION
                ================================================= */}

                <div className="product-price">

                    {/* CURRENT PRICE */}

                    <strong className="current-price">
                        ₹{sellingPrice.toLocaleString("en-IN")}
                    </strong>


                    {/* OLD PRICE */}

                    {isOnSale && (
                        <span className="old-price">
                            ₹{comparePrice.toLocaleString("en-IN")}
                        </span>
                    )}


                    {/* DISCOUNT */}

                    {isOnSale && (
                        <span className="discount-price">
                            {discountPercentage}% OFF
                        </span>
                    )}

                </div>


                {/* =================================================
                   SALE MESSAGE
                ================================================= */}

                {isOnSale && (
                    <span className="product-sale-label">
                        Limited-time offer
                    </span>
                )}

            </div>

        </motion.article>
    );
}