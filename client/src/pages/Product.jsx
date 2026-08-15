import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Heart,
    Minus,
    Plus,
    ShoppingBag,
    Star,
} from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar/Navbar";
import ProductCard from "../components/ProductCard/ProductCard";
import productService from "../services/productService";
import { useWishlist } from "../context/WishlistContext";

import "./Product.css";

const FALLBACK_IMAGE =
    "https://placehold.co/800x1000/111111/ffffff?text=BrandBlvd";

export default function Product() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const {
        addToWishlist,
        isInWishlist,
        loading: wishlistLoading,
    } = useWishlist();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await productService.getProduct(id);

                const data = response.data;

                const fetchedProduct =
                    data.product ||
                    data.data ||
                    data;

                setProduct(fetchedProduct);
            } catch (err) {
                console.error(
                    "Failed to fetch product:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load this product."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="product-page">
                    <div className="product-loading">
                        <div className="product-loading-image" />

                        <div className="product-loading-info">
                            <div />
                            <div />
                            <div />
                            <div />
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Navbar />

                <main className="product-page">
                    <div className="product-error">
                        <h1>Product not found</h1>

                        <p>
                            {error ||
                                "This product may have been removed."}
                        </p>

                        <Link to="/shop">
                            Back to Shop
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    const images =
        product.images?.length > 0
            ? product.images
            : [FALLBACK_IMAGE];

    /* =====================================================
       PRICING
    ===================================================== */

    const price = Number(product.price || 0);

    /*
       Support the compare-at/original price regardless
       of which field your backend currently returns.
    */
    const comparePrice = Number(
        product.originalPrice ??
        product.compareAtPrice ??
        product.comparePrice ??
        product.mrp ??
        0
    );

    /*
       If a valid compare price is greater than the
       selling price, the product is on sale.
    */
    const isOnSale =
        comparePrice > price &&
        price > 0;

    const discount = isOnSale
        ? Math.round(
            ((comparePrice - price) /
                comparePrice) *
                100
        )
        : 0;

    const finalPrice = price;

    const sizes =
        product.sizes?.length > 0
            ? product.sizes
            : ["S", "M", "L", "XL"];

    const colors =
        product.colors?.length > 0
            ? product.colors
            : [];

    const stock = Number(product.stock || 0);

    const decreaseQuantity = () => {
        setQuantity((current) =>
            Math.max(1, current - 1)
        );
    };

    const increaseQuantity = () => {
        setQuantity((current) =>
            Math.min(
                stock || 1,
                current + 1
            )
        );
    };

    const handleAddToCart = () => {
        /*
          We'll connect this button to the real Cart API
          in the next checkout/cart milestone.
        */

        console.log("Add to cart", {
            product: product._id,
            quantity,
            size: selectedSize,
            color: selectedColor,
        });
    };

    const handleWishlist = async () => {
        const alreadyAdded =
            isInWishlist(product._id);

        if (alreadyAdded) {
            return;
        }

        const result =
            await addToWishlist(product._id);

        if (result.requiresLogin) {
            navigate("/login");
            return;
        }

        if (!result.success) {
            alert(
                result.message ||
                "Unable to add to wishlist"
            );
        }
    };
    return (
        <>
            <Navbar />

            <main className="product-page">

                {/* Breadcrumb */}
                <div className="product-breadcrumb">
                    <Link to="/">Home</Link>

                    <span>/</span>

                    <Link to="/shop">Shop</Link>

                    <span>/</span>

                    <span>{product.name}</span>
                </div>

                {/* Main Product */}
                <section className="product-main">

                    {/* Gallery */}
                    <div className="product-gallery">

                        <div className="thumbnail-list">

                            {images.map(
                                (image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        className={
                                            activeImage === index
                                                ? "thumbnail active"
                                                : "thumbnail"
                                        }
                                        onClick={() =>
                                            setActiveImage(index)
                                        }
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1
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

                        <div className="main-product-image">

                            <motion.img
                                key={activeImage}
                                src={images[activeImage]}
                                alt={product.name}
                                initial={{
                                    opacity: 0.5,
                                    scale: 1.02,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                transition={{
                                    duration: 0.35,
                                }}
                                onError={(event) => {
                                    event.currentTarget.src =
                                        FALLBACK_IMAGE;
                                }}
                            />

                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        className="gallery-arrow gallery-prev"
                                        onClick={() =>
                                            setActiveImage(
                                                activeImage === 0
                                                    ? images.length - 1
                                                    : activeImage - 1
                                            )
                                        }
                                    >
                                        <ChevronLeft
                                            size={20}
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        className="gallery-arrow gallery-next"
                                        onClick={() =>
                                            setActiveImage(
                                                activeImage ===
                                                    images.length - 1
                                                    ? 0
                                                    : activeImage + 1
                                            )
                                        }
                                    >
                                        <ChevronRight
                                            size={20}
                                        />
                                    </button>
                                </>
                            )}

                            {isOnSale && (
                                <span className="detail-discount">
                                    {discount}% OFF
                                </span>
                            )}

                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="product-details">

                        <div className="product-detail-top">

                            <div>
                                <span className="detail-brand">
                                    {product.brand ||
                                        "BrandBlvd"}
                                </span>

                                <h1>{product.name}</h1>
                            </div>

                            <button
                                type="button"
                                className={`detail-wishlist ${isInWishlist(product._id)
                                        ? "wishlist-active"
                                        : ""
                                    }`}
                                onClick={handleWishlist}
                                disabled={wishlistLoading}
                                aria-label="Add to wishlist"
                            >
                                <Heart
                                    size={21}
                                    fill={
                                        isInWishlist(product._id)
                                            ? "currentColor"
                                            : "none"
                                    }
                                />
                            </button>

                        </div>

                        {/* Rating */}
                        <div className="detail-rating">

                            <div className="detail-stars">
                                {Array.from({
                                    length: 5,
                                }).map((_, index) => (
                                    <Star
                                        key={index}
                                        size={15}
                                        fill={
                                            index <
                                                Math.round(
                                                    product.ratings || 0
                                                )
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                ))}
                            </div>

                            <span>
                                {Number(
                                    product.ratings || 0
                                ).toFixed(1)}
                            </span>

                            <span>
                                {product.numReviews || 0} reviews
                            </span>

                        </div>

                        {/* Price */}
                        <div className="detail-price">

                            {isOnSale && (
                                <span className="detail-sale-badge">
                                    {discount}% OFF
                                </span>
                            )}

                            <div className="detail-price-row">

                                <strong>
                                    ₹
                                    {finalPrice.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                                {isOnSale && (
                                    <span className="detail-compare-price">
                                        ₹
                                        {comparePrice.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                )}

                            </div>

                            {isOnSale && (
                                <small className="detail-sale-label">
                                    ON SALE
                                </small>
                            )}

                        </div>

                        {/* Description */}
                        <p className="detail-description">
                            {product.description}
                        </p>

                        {/* Size */}
                        <div className="option-group">

                            <div className="option-heading">
                                <h3>Size</h3>

                                {selectedSize && (
                                    <span>
                                        Selected: {selectedSize}
                                    </span>
                                )}
                            </div>

                            <div className="size-options">

                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={
                                            selectedSize === size
                                                ? "size-option selected"
                                                : "size-option"
                                        }
                                        onClick={() =>
                                            setSelectedSize(size)
                                        }
                                    >
                                        {size}
                                    </button>
                                ))}

                            </div>

                        </div>

                        {/* Color */}
                        {colors.length > 0 && (
                            <div className="option-group">

                                <div className="option-heading">
                                    <h3>Color</h3>

                                    {selectedColor && (
                                        <span>
                                            {selectedColor}
                                        </span>
                                    )}
                                </div>

                                <div className="color-options">

                                    {colors.map(
                                        (color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={
                                                    selectedColor ===
                                                        color
                                                        ? "color-option selected"
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

                        {/* Stock */}
                        <div className="stock-status">

                            <span
                                className={
                                    stock > 0
                                        ? "stock-dot"
                                        : "stock-dot sold-out"
                                }
                            />

                            {stock > 0
                                ? stock <= 5
                                    ? `Only ${stock} left`
                                    : "In stock"
                                : "Out of stock"}

                        </div>

                        {/* Quantity + Cart */}
                        <div className="purchase-row">

                            <div className="quantity-control">

                                <button
                                    type="button"
                                    onClick={
                                        decreaseQuantity
                                    }
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={15} />
                                </button>

                                <span>{quantity}</span>

                                <button
                                    type="button"
                                    onClick={
                                        increaseQuantity
                                    }
                                    disabled={
                                        quantity >= stock
                                    }
                                >
                                    <Plus size={15} />
                                </button>

                            </div>

                            <button
                                type="button"
                                className="add-cart-button"
                                disabled={stock === 0}
                                onClick={
                                    handleAddToCart
                                }
                            >
                                <ShoppingBag size={18} />

                                {stock > 0
                                    ? "Add to Cart"
                                    : "Out of Stock"}
                            </button>

                        </div>

                        {/* Product details */}
                        <div className="product-meta">

                            <div>
                                <span>Category</span>
                                <strong>
                                    {product.category ||
                                        "Men's Fashion"}
                                </strong>
                            </div>

                            <div>
                                <span>Brand</span>
                                <strong>
                                    {product.brand ||
                                        "BrandBlvd"}
                                </strong>
                            </div>

                            <div>
                                <span>Product ID</span>
                                <strong>
                                    {String(
                                        product._id
                                    ).slice(-8)}
                                </strong>
                            </div>

                        </div>

                    </div>
                </section>

                {/* Reviews */}
                <section className="reviews-section">

                    <div className="reviews-heading">
                        <div>
                            <span>WHAT CUSTOMERS SAY</span>

                            <h2>
                                Customer Reviews
                            </h2>
                        </div>

                        <div className="reviews-summary">
                            <strong>
                                {Number(
                                    product.ratings || 0
                                ).toFixed(1)}
                            </strong>

                            <div>
                                <div className="detail-stars">
                                    {Array.from({
                                        length: 5,
                                    }).map(
                                        (_, index) => (
                                            <Star
                                                key={index}
                                                size={15}
                                                fill={
                                                    index <
                                                        Math.round(
                                                            product.ratings ||
                                                            0
                                                        )
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                            />
                                        )
                                    )}
                                </div>

                                <span>
                                    Based on{" "}
                                    {product.numReviews ||
                                        0}{" "}
                                    reviews
                                </span>
                            </div>
                        </div>
                    </div>

                    {product.reviews?.length > 0 ? (
                        <div className="reviews-list">

                            {product.reviews.map(
                                (review) => (
                                    <article
                                        className="review-card"
                                        key={
                                            review._id
                                        }
                                    >
                                        <div className="review-top">

                                            <strong>
                                                {review.name ||
                                                    "Customer"}
                                            </strong>

                                            <span>
                                                {new Date(
                                                    review.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )}
                                            </span>

                                        </div>

                                        <div className="detail-stars">
                                            {Array.from({
                                                length: 5,
                                            }).map(
                                                (_, index) => (
                                                    <Star
                                                        key={
                                                            index
                                                        }
                                                        size={
                                                            14
                                                        }
                                                        fill={
                                                            index <
                                                                Number(
                                                                    review.rating ||
                                                                    0
                                                                )
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>

                                        <p>
                                            {
                                                review.comment
                                            }
                                        </p>
                                    </article>
                                )
                            )}

                        </div>
                    ) : (
                        <div className="no-reviews">
                            <p>
                                No reviews yet. Be the
                                first to review this
                                product.
                            </p>
                        </div>
                    )}

                </section>

                {/* Back */}
                <div className="product-back">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>

                </div>

            </main>
        </>
    );
}