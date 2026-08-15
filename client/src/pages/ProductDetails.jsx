import { useEffect, useMemo, useState } from "react";

import {
    ArrowLeft,
    Heart,
    Minus,
    Plus,
    ShoppingBag,
} from "lucide-react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import Navbar from "../components/Navbar/Navbar";
import api from "../services/api";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import "./ProductDetails.css";

const FALLBACK_IMAGE =
    "https://placehold.co/800x1000/111111/ffffff?text=BrandBlvd";

const SIZE_ORDER = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "3XL",
];

const sortSizes = (sizes = []) => {
    return [...sizes].sort((a, b) => {
        const sizeA = String(a)
            .trim()
            .toUpperCase();

        const sizeB = String(b)
            .trim()
            .toUpperCase();

        const indexA =
            SIZE_ORDER.indexOf(sizeA);

        const indexB =
            SIZE_ORDER.indexOf(sizeB);

        if (
            indexA === -1 &&
            indexB === -1
        ) {
            return sizeA.localeCompare(
                sizeB
            );
        }

        if (indexA === -1) {
            return 1;
        }

        if (indexB === -1) {
            return -1;
        }

        return indexA - indexB;
    });
};

const getOriginalPrice = (product) => {
    if (!product) {
        return 0;
    }

    return Number(
        product.originalPrice ??
        product.compareAtPrice ??
        product.comparePrice ??
        product.mrp ??
        product.oldPrice ??
        product.regularPrice ??
        0
    );
};

const getDiscountPercentage = (
    originalPrice,
    salePrice
) => {
    if (
        originalPrice <= 0 ||
        salePrice <= 0 ||
        originalPrice <= salePrice
    ) {
        return 0;
    }

    return Math.round(
        ((originalPrice - salePrice) /
            originalPrice) *
            100
    );
};

export default function ProductDetails() {
    const { id } = useParams();

    const navigate = useNavigate();

    const {
        addToCart,
        loading: cartLoading,
    } = useCart();

    const {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        loading: wishlistLoading,
    } = useWishlist();

    const [product, setProduct] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedImage, setSelectedImage] =
        useState(0);

    const [selectedSize, setSelectedSize] =
        useState("");

    const [selectedColor, setSelectedColor] =
        useState("");

    const [quantity, setQuantity] =
        useState(1);

    /* =====================================================
       REVIEWS
    ===================================================== */

    const [reviews, setReviews] =
        useState([]);

    const [reviewsLoading, setReviewsLoading] =
        useState(false);

    const [reviewRating, setReviewRating] =
        useState(0);

    const [reviewComment, setReviewComment] =
        useState("");

    const [reviewSubmitting, setReviewSubmitting] =
        useState(false);

    const [reviewMessage, setReviewMessage] =
        useState("");

    const [reviewError, setReviewError] =
        useState("");

    useEffect(() => {
        let mounted = true;

        const loadProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/products/${id}`
                    );

                if (
                    !response.data?.success
                ) {
                    throw new Error(
                        "Unable to load product."
                    );
                }

                const data =
                    response.data.product;

                if (
                    !data ||
                    data.isVisible === false
                ) {
                    throw new Error(
                        "Product is not available."
                    );
                }

                if (!mounted) {
                    return;
                }

                setProduct(data);

                setSelectedImage(0);

                const sortedSizes =
                    sortSizes(
                        data.sizes || []
                    );

                if (
                    sortedSizes.length > 0
                ) {
                    setSelectedSize(
                        sortedSizes[0]
                    );
                } else {
                    setSelectedSize("");
                }

                if (
                    data.colors?.length > 0
                ) {
                    setSelectedColor(
                        data.colors[0]
                    );
                } else {
                    setSelectedColor("");
                }

                setQuantity(1);

            } catch (err) {
                console.error(
                    "Failed to load product:",
                    err
                );

                if (!mounted) {
                    return;
                }

                setError(
                    err.response?.data
                        ?.message ||
                    err.message ||
                    "Unable to load product."
                );

            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadProduct();

        return () => {
            mounted = false;
        };

    }, [id]);

    /* =====================================================
       LOAD REVIEWS
    ===================================================== */

    useEffect(() => {
        let mounted = true;

        const loadReviews = async () => {
            if (!id) {
                return;
            }

            try {
                setReviewsLoading(true);
                setReviewError("");

                const response = await api.get(
                    `/reviews/${id}`
                );

                if (!mounted) {
                    return;
                }

                const data =
                    response.data?.reviews || [];

                setReviews(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch (err) {
                console.error(
                    "Failed to load reviews:",
                    err
                );

                if (mounted) {
                    setReviews([]);
                    setReviewError(
                        err.response?.data?.message ||
                        "Unable to load reviews."
                    );
                }
            } finally {
                if (mounted) {
                    setReviewsLoading(false);
                }
            }
        };

        loadReviews();

        return () => {
            mounted = false;
        };
    }, [id]);

    const reviewAverage = useMemo(() => {
        if (!reviews.length) {
            return Number(product?.rating || 0);
        }

        const total = reviews.reduce(
            (sum, review) =>
                sum + Number(review.rating || 0),
            0
        );

        return total / reviews.length;
    }, [reviews, product]);

    const refreshReviews = async () => {
        const response = await api.get(
            `/reviews/${id}`
        );

        const data =
            response.data?.reviews || [];

        setReviews(
            Array.isArray(data)
                ? data
                : []
        );
    };

    const handleSubmitReview = async (event) => {
        event.preventDefault();

        setReviewError("");
        setReviewMessage("");

        if (reviewRating < 1 || reviewRating > 5) {
            setReviewError(
                "Please select a rating from 1 to 5 stars."
            );
            return;
        }

        if (!reviewComment.trim()) {
            setReviewError(
                "Please write a review before submitting."
            );
            return;
        }

        try {
            setReviewSubmitting(true);

            await api.post("/reviews", {
                productId: product._id,
                rating: reviewRating,
                comment: reviewComment.trim(),
            });

            await refreshReviews();

            setReviewRating(0);
            setReviewComment("");

            setReviewMessage(
                "Review added successfully."
            );
        } catch (err) {
            const status =
                err.response?.status;

            const message =
                err.response?.data?.message ||
                "Unable to submit your review.";

            if (status === 401) {
                navigate("/login", {
                    state: {
                        from: `/product/${product._id}`,
                    },
                });
                return;
            }

            setReviewError(message);
        } finally {
            setReviewSubmitting(false);
        }
    };

    const formatReviewDate = (date) => {
        if (!date) {
            return "";
        }

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "";
        }

        return parsed.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const renderStars = (rating) => {
        const value = Math.round(
            Number(rating || 0)
        );

        return (
            <span
                className="review-stars"
                aria-label={`${value} out of 5 stars`}
            >
                {[1, 2, 3, 4, 5].map(
                    (star) => (
                        <span
                            key={star}
                            className={
                                star <= value
                                    ? "filled"
                                    : ""
                            }
                        >
                            ★
                        </span>
                    )
                )}
            </span>
        );
    };

    const images = useMemo(() => {
        if (
            product?.images &&
            Array.isArray(product.images) &&
            product.images.length > 0
        ) {
            return product.images.filter(
                Boolean
            );
        }

        return [FALLBACK_IMAGE];

    }, [product]);

    const sortedSizes = useMemo(() => {
        return sortSizes(
            product?.sizes || []
        );
    }, [product]);

    const salePrice = Number(
        product?.price || 0
    );

    const originalPrice =
        getOriginalPrice(product);

    const isOnSale =
        originalPrice > salePrice &&
        salePrice > 0;

    const discountPercentage =
        getDiscountPercentage(
            originalPrice,
            salePrice
        );

    const stock = Number(
        product?.stock || 0
    );

    const outOfStock =
        stock <= 0;

    const wishlistItem =
        wishlist?.find(
            (item) =>
                item.product?._id ===
                product?._id
        );

    const isWishlisted =
        Boolean(wishlistItem);

    const handleWishlist =
        async () => {

            if (!product) {
                return;
            }

            if (isWishlisted) {
                const result =
                    await removeFromWishlist(
                        wishlistItem._id
                    );

                if (
                    result &&
                    result.success === false
                ) {
                    alert(
                        result.message ||
                        "Unable to remove from wishlist."
                    );
                }

                return;
            }

            const result =
                await addToWishlist(
                    product._id
                );

            if (
                result?.requiresLogin
            ) {
                navigate(
                    "/login",
                    {
                        state: {
                            from:
                                `/product/${product._id}`,
                        },
                    }
                );

                return;
            }

            if (
                result &&
                result.success === false
            ) {
                alert(
                    result.message ||
                    "Unable to add to wishlist."
                );
            }
        };

    const handleAddToCart =
        async () => {

            if (!product) {
                return;
            }

            if (
                product.sizes?.length > 0 &&
                !selectedSize
            ) {
                alert(
                    "Please select a size."
                );

                return;
            }

            if (
                product.colors?.length > 0 &&
                !selectedColor
            ) {
                alert(
                    "Please select a colour."
                );

                return;
            }

            if (outOfStock) {
                alert(
                    "This product is out of stock."
                );

                return;
            }

            if (
                quantity > stock
            ) {
                alert(
                    "Selected quantity is not available."
                );

                return;
            }

            try {
                const result =
                    await addToCart(
                        product._id,
                        quantity,
                        selectedSize,
                        selectedColor
                    );

                if (
                    result?.requiresLogin
                ) {
                    navigate(
                        "/login",
                        {
                            state: {
                                from:
                                    `/product/${product._id}`,
                            },
                        }
                    );

                    return;
                }

                if (
                    !result?.success
                ) {
                    alert(
                        result?.message ||
                        "Unable to add product to cart."
                    );

                    return;
                }

                alert(
                    "Product added to cart!"
                );

            } catch (err) {
                console.error(
                    "Add to cart error:",
                    err
                );

                alert(
                    err.response?.data
                        ?.message ||
                    "Unable to add product to cart."
                );
            }
        };

    const increaseQuantity =
        () => {

            if (
                product &&
                quantity < stock
            ) {
                setQuantity(
                    current =>
                        current + 1
                );
            }
        };

    const decreaseQuantity =
        () => {

            setQuantity(
                current =>
                    Math.max(
                        1,
                        current - 1
                    )
            );
        };

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="product-details-page">

                    <div className="product-details-loading">

                        <div className="product-loading-spinner" />

                        <span>
                            Loading product...
                        </span>

                    </div>

                </main>
            </>
        );
    }

    if (
        error ||
        !product
    ) {
        return (
            <>
                <Navbar />

                <main className="product-details-page">

                    <div className="product-details-error">

                        <h1>
                            Product unavailable
                        </h1>

                        <p>
                            {error ||
                                "This product could not be found."}
                        </p>

                        <Link to="/shop">
                            Back to Shop
                        </Link>

                    </div>

                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="product-details-page">

                <div className="product-details-container">

                    {}

                    <button
                        type="button"
                        className="product-back"
                        onClick={() =>
                            navigate("/shop")
                        }
                    >

                        <ArrowLeft size={15} />

                        Back to Shop

                    </button>

                    {}

                    <div className="product-details-layout">

                        {}

                        <motion.div
                            className="product-gallery"

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

                            {}

                            {isOnSale && (
                                <div className="product-sale-badge">
                                    {discountPercentage > 0
                                        ? `${discountPercentage}% OFF`
                                        : "ON SALE"}
                                </div>
                            )}

                            {}

                            <div className="product-main-image">

                                <img
                                    src={
                                        images[
                                            selectedImage
                                        ] ||
                                        FALLBACK_IMAGE
                                    }

                                    alt={
                                        product.name ||
                                        "Product"
                                    }

                                    onError={(
                                        event
                                    ) => {
                                        event.currentTarget.src =
                                            FALLBACK_IMAGE;
                                    }}
                                />

                            </div>

                            {}

                            {images.length > 1 && (

                                <div className="product-thumbnails">

                                    {images.map(
                                        (
                                            image,
                                            index
                                        ) => (

                                            <button
                                                type="button"

                                                key={`${image}-${index}`}

                                                className={
                                                    selectedImage ===
                                                    index
                                                        ? "thumbnail active"
                                                        : "thumbnail"
                                                }

                                                onClick={() =>
                                                    setSelectedImage(
                                                        index
                                                    )
                                                }

                                                aria-label={`View image ${
                                                    index + 1
                                                }`}
                                            >

                                                <img
                                                    src={
                                                        image
                                                    }

                                                    alt={`${product.name} ${
                                                        index + 1
                                                    }`}

                                                    onError={(
                                                        event
                                                    ) => {
                                                        event.currentTarget.src =
                                                            FALLBACK_IMAGE;
                                                    }}
                                                />

                                            </button>

                                        )
                                    )}

                                </div>

                            )}

                        </motion.div>

                        {}

                        <motion.div
                            className="product-info"

                            initial={{
                                opacity: 0,
                                x: 25,
                            }}

                            animate={{
                                opacity: 1,
                                x: 0,
                            }}

                            transition={{
                                duration: 0.5,
                                delay: 0.1,
                            }}
                        >

                            {}

                            <span className="product-brand">

                                {product.brand ||
                                    "BrandBlvd"}

                            </span>

                            {}

                            <div className="product-title-row">

                                <h1>
                                    {product.name}
                                </h1>

                                {}

                                <button
                                    type="button"

                                    className={`product-wishlist-top ${
                                        isWishlisted
                                            ? "active"
                                            : ""
                                    }`}

                                    disabled={
                                        wishlistLoading
                                    }

                                    onClick={
                                        handleWishlist
                                    }

                                    aria-label={
                                        isWishlisted
                                            ? "Remove from wishlist"
                                            : "Add to wishlist"
                                    }
                                >

                                    <Heart
                                        size={20}
                                        fill={
                                            isWishlisted
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />

                                </button>

                            </div>

                            {}

                            {reviewAverage > 0 && (

                                <a
                                    href="#customer-reviews"
                                    className="product-rating"
                                >

                                    <span className="rating-stars">
                                        ★★★★★
                                    </span>

                                    <span>
                                        {reviewAverage.toFixed(1)}
                                    </span>

                                    <span className="product-review-count">
                                        ({reviews.length || Number(product.numReviews || 0)})
                                    </span>

                                </a>

                            )}

                            {}

                            <div className="product-price-area">

                                {}

                                <span className="product-price">

                                    ₹
                                    {salePrice.toLocaleString(
                                        "en-IN"
                                    )}

                                </span>

                                {}

                                {isOnSale && (

                                    <span className="product-original-price">

                                        ₹
                                        {originalPrice.toLocaleString(
                                            "en-IN"
                                        )}

                                    </span>

                                )}

                                {}

                                {isOnSale &&
                                    discountPercentage >
                                        0 && (

                                        <span className="product-discount">

                                            {discountPercentage}%
                                            OFF

                                        </span>

                                    )}

                            </div>

                            {}

                            {isOnSale && (
                                <div className="sale-message">

                                    Limited-time offer

                                </div>
                            )}

                            <div className="product-divider" />

                            {}

                            <p className="product-description">

                                {product.description ||
                                    "A carefully selected piece from the BrandBlvd collection."}

                            </p>

                            {}

                            {sortedSizes.length >
                                0 && (

                                <div className="product-option">

                                    <div className="product-option-header">

                                        <strong>
                                            Select Size
                                        </strong>

                                        {selectedSize && (
                                            <span>
                                                {selectedSize}
                                            </span>
                                        )}

                                    </div>

                                    <div className="product-size-options">

                                        {sortedSizes.map(
                                            size => (

                                                <button
                                                    type="button"

                                                    key={size}

                                                    className={
                                                        selectedSize ===
                                                        size
                                                            ? "size-option active"
                                                            : "size-option"
                                                    }

                                                    onClick={() =>
                                                        setSelectedSize(
                                                            size
                                                        )
                                                    }
                                                >
                                                    {size}
                                                </button>

                                            )
                                        )}

                                    </div>

                                </div>

                            )}

                            {}

                            {product.colors?.length >
                                0 && (

                                <div className="product-option">

                                    <div className="product-option-header">

                                        <strong>
                                            Select Colour
                                        </strong>

                                        {selectedColor && (
                                            <span>
                                                {selectedColor}
                                            </span>
                                        )}

                                    </div>

                                    <div className="product-color-options">

                                        {product.colors.map(
                                            color => (

                                                <button
                                                    type="button"

                                                    key={color}

                                                    className={
                                                        selectedColor ===
                                                        color
                                                            ? "color-option active"
                                                            : "color-option"
                                                    }

                                                    onClick={() =>
                                                        setSelectedColor(
                                                            color
                                                        )
                                                    }
                                                >
                                                    {color}
                                                </button>

                                            )
                                        )}

                                    </div>

                                </div>

                            )}

                            {}

                            <div className="product-option">

                                <div className="product-option-header">

                                    <strong>
                                        Quantity
                                    </strong>

                                    <span
                                        className={
                                            outOfStock
                                                ? "stock-out"
                                                : ""
                                        }
                                    >

                                        {outOfStock
                                            ? "Out of stock"
                                            : `${stock} available`}

                                    </span>

                                </div>

                                <div className="quantity-control">

                                    <button
                                        type="button"

                                        onClick={
                                            decreaseQuantity
                                        }

                                        disabled={
                                            quantity <= 1
                                        }

                                        aria-label="Decrease quantity"
                                    >

                                        <Minus
                                            size={15}
                                        />

                                    </button>

                                    <span>
                                        {quantity}
                                    </span>

                                    <button
                                        type="button"

                                        onClick={
                                            increaseQuantity
                                        }

                                        disabled={
                                            quantity >=
                                            stock
                                        }

                                        aria-label="Increase quantity"
                                    >

                                        <Plus
                                            size={15}
                                        />

                                    </button>

                                </div>

                            </div>

                            {}

                            <div className="product-actions">

                                {}

                                <button
                                    type="button"

                                    className="add-cart-button"

                                    disabled={
                                        outOfStock ||
                                        cartLoading
                                    }

                                    onClick={
                                        handleAddToCart
                                    }
                                >

                                    <ShoppingBag
                                        size={18}
                                    />

                                    {cartLoading
                                        ? "Adding..."
                                        : outOfStock
                                            ? "Out of Stock"
                                            : "Add to Cart"}

                                </button>

                                {}

                                <button
                                    type="button"

                                    className={`wishlist-button ${
                                        isWishlisted
                                            ? "active"
                                            : ""
                                    }`}

                                    disabled={
                                        wishlistLoading
                                    }

                                    onClick={
                                        handleWishlist
                                    }

                                    aria-label={
                                        isWishlisted
                                            ? "Remove from wishlist"
                                            : "Add to wishlist"
                                    }
                                >

                                    <Heart
                                        size={20}
                                        fill={
                                            isWishlisted
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />

                                </button>

                            </div>

                            {}

                            <div className="product-meta">

                                <span>
                                    Free shipping on eligible
                                    orders
                                </span>

                                <span>
                                    Secure checkout
                                </span>

                            </div>

                        </motion.div>

                    </div>

                    {/* =================================================
                        CUSTOMER REVIEWS
                    ================================================= */}

                    <section
                        id="customer-reviews"
                        className="customer-reviews"
                    >

                        <div className="customer-reviews-header">

                            <div>
                                <span className="customer-reviews-eyebrow">
                                    WHAT CUSTOMERS SAY
                                </span>

                                <h2>
                                    Customer Reviews
                                </h2>
                            </div>

                            <div className="customer-reviews-summary">

                                <strong>
                                    {reviewAverage > 0
                                        ? reviewAverage.toFixed(1)
                                        : "0.0"}
                                </strong>

                                {renderStars(reviewAverage)}

                                <span>
                                    {reviews.length}{" "}
                                    {reviews.length === 1
                                        ? "review"
                                        : "reviews"}
                                </span>

                            </div>

                        </div>

                        <div className="customer-reviews-divider" />

                        <div className="review-write-area">

                            <div className="review-write-heading">
                                <span className="customer-reviews-eyebrow">
                                    YOUR EXPERIENCE
                                </span>

                                <h3>
                                    Write a Review
                                </h3>
                            </div>

                            <form
                                className="review-form"
                                onSubmit={handleSubmitReview}
                            >

                                <div className="review-rating-input">

                                    <span>
                                        Your rating
                                    </span>

                                    <div
                                        className="review-rating-buttons"
                                        role="radiogroup"
                                        aria-label="Product rating"
                                    >
                                        {[1, 2, 3, 4, 5].map(
                                            (star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={
                                                        star <= reviewRating
                                                            ? "review-star-button active"
                                                            : "review-star-button"
                                                    }
                                                    onClick={() =>
                                                        setReviewRating(star)
                                                    }
                                                    aria-label={`${star} star`}
                                                    aria-pressed={
                                                        star === reviewRating
                                                    }
                                                >
                                                    ★
                                                </button>
                                            )
                                        )}
                                    </div>

                                </div>

                                <textarea
                                    className="review-textarea"
                                    value={reviewComment}
                                    onChange={(event) =>
                                        setReviewComment(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Tell other customers what you think about this product..."
                                    maxLength={1000}
                                    rows={5}
                                    disabled={reviewSubmitting}
                                />

                                {reviewError && (
                                    <p className="review-form-error">
                                        {reviewError}
                                    </p>
                                )}

                                {reviewMessage && (
                                    <p className="review-form-success">
                                        {reviewMessage}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="review-submit-button"
                                    disabled={reviewSubmitting}
                                >
                                    {reviewSubmitting
                                        ? "Submitting..."
                                        : "Submit Review"}
                                </button>

                            </form>

                        </div>

                        <div className="customer-reviews-divider" />

                        <div className="reviews-list">

                            {reviewsLoading ? (

                                <div className="reviews-state">
                                    <div className="product-loading-spinner" />
                                    <p>
                                        Loading reviews...
                                    </p>
                                </div>

                            ) : reviewError &&
                              reviews.length === 0 ? (

                                <div className="reviews-state">
                                    <p>
                                        {reviewError}
                                    </p>
                                </div>

                            ) : reviews.length === 0 ? (

                                <div className="reviews-state">
                                    <h3>
                                        No reviews yet
                                    </h3>

                                    <p>
                                        Be the first to review this product.
                                    </p>
                                </div>

                            ) : (

                                reviews.map((review) => (

                                    <article
                                        className="review-item"
                                        key={review._id}
                                    >

                                        <div className="review-item-top">

                                            <div>
                                                <strong>
                                                    {review.user?.name ||
                                                        review.name ||
                                                        "Customer"}
                                                </strong>

                                                {renderStars(
                                                    review.rating
                                                )}
                                            </div>

                                            <time>
                                                {formatReviewDate(
                                                    review.createdAt ||
                                                        review.updatedAt
                                                )}
                                            </time>

                                        </div>

                                        <p>
                                            {review.comment}
                                        </p>

                                    </article>

                                ))

                            )}

                        </div>

                    </section>

                </div>

            </main>
        </>
    );
}