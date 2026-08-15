import { Link } from "react-router-dom";
import {
    Heart,
    ShoppingBag,
    Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar/Navbar";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

import "./Wishlist.css";

const FALLBACK_IMAGE =
    "https://placehold.co/600x750/eeeeee/111111?text=BrandBlvd";

export default function Wishlist() {
    const {
        wishlist,
        loading,
        removeFromWishlist,
    } = useWishlist();

    const { addToCart } = useCart();

    const handleAddToCart = async (
        productId,
        wishlistId
    ) => {
        const result = await addToCart(
            productId,
            1
        );

        if (result?.requiresLogin) {
            return;
        }

        if (result?.success) {
            await removeFromWishlist(
                wishlistId
            );
        }
    };

    return (
        <>
            <Navbar />

            <main className="wishlist-page">

                {/* Header */}
                <section className="wishlist-header">

                    <div>
                        <span>
                            BRAND BLVD / SAVED
                        </span>

                        <h1>
                            Wishlist
                        </h1>

                        <p>
                            Pieces you've saved
                            for later.
                        </p>
                    </div>

                    <span className="wishlist-count">
                        {wishlist.length}{" "}
                        {wishlist.length === 1
                            ? "Item"
                            : "Items"}
                    </span>

                </section>


                {/* Empty Wishlist */}
                {!loading &&
                wishlist.length === 0 ? (
                    <section className="wishlist-empty">

                        <div className="wishlist-empty-icon">
                            <Heart size={28} />
                        </div>

                        <h2>
                            Your Wishlist is Empty
                        </h2>

                        <p>
                            Save your favourite
                            pieces here and come
                            back to them anytime.
                        </p>

                        <Link to="/shop">
                            Explore Men's Collection
                        </Link>

                    </section>
                ) : loading ? (

                    <section className="wishlist-empty">

                        <div className="wishlist-empty-icon">
                            <Heart size={28} />
                        </div>

                        <h2>
                            Loading Wishlist
                        </h2>

                        <p>
                            Please wait while we
                            load your saved items.
                        </p>

                    </section>

                ) : (

                    /* Wishlist Products */
                    <section className="wishlist-grid">

                        {wishlist.map(
                            (item, index) => {

                                const product =
                                    item.product;

                                if (!product) {
                                    return null;
                                }

                                const image =
                                    product.images?.[0] ||
                                    FALLBACK_IMAGE;

                                return (
                                    <motion.article
                                        key={item._id}
                                        className="wishlist-card"

                                        initial={{
                                            opacity: 0,
                                            y: 20,
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

                                        {/* Image */}
                                        <div className="wishlist-image">

                                            <Link
                                                to={`/product/${product._id}`}
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

                                            <button
                                                type="button"
                                                className="wishlist-remove"

                                                onClick={() =>
                                                    removeFromWishlist(
                                                        item._id
                                                    )
                                                }

                                                disabled={loading}

                                                aria-label="Remove from wishlist"
                                            >
                                                <Trash2
                                                    size={16}
                                                />
                                            </button>

                                        </div>


                                        {/* Product Info */}
                                        <div className="wishlist-info">

                                            <span>
                                                {product.brand ||
                                                    "BrandBlvd"}
                                            </span>

                                            <Link
                                                to={`/product/${product._id}`}
                                            >
                                                {product.name}
                                            </Link>

                                            <strong>
                                                ₹
                                                {Number(
                                                    product.price ||
                                                        0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                            <button
                                                type="button"
                                                className="wishlist-cart"

                                                onClick={() =>
                                                    handleAddToCart(
                                                        product._id,
                                                        item._id
                                                    )
                                                }
                                            >
                                                <ShoppingBag
                                                    size={16}
                                                />

                                                Add to Cart
                                            </button>

                                        </div>

                                    </motion.article>
                                );
                            }
                        )}

                    </section>
                )}

            </main>
        </>
    );
}