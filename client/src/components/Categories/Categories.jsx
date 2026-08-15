import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { useProducts } from "../../hooks/useProducts";

import "./Categories.css";

const FALLBACK_IMAGE =
    "https://placehold.co/800x1000/111111/ffffff?text=BrandBlvd";

const MEN_CLOTHING_CATEGORIES = [
    "T-Shirts",
    "Shirts",
    "Polo Shirts",
    "Hoodies",
    "Sweatshirts",
    "Jackets",
    "Jeans",
    "Trousers",
    "Cargo Pants",
    "Shorts",
    "Tracksuits",
];

export default function Categories() {
    const { products, loading } = useProducts();

    const categoryMap = new Map();

    products.forEach((product) => {
        if (!product.category) return;

        // Only men's clothing categories
        if (
            !MEN_CLOTHING_CATEGORIES.includes(
                product.category
            )
        ) {
            return;
        }

        // Only use the first product for each category
        if (!categoryMap.has(product.category)) {
            categoryMap.set(
                product.category,
                product
            );
        }
    });

    const categories = Array.from(
        categoryMap.entries()
    ).map(([name, product]) => ({
        name,
        image:
            product.images?.[0] ||
            FALLBACK_IMAGE,
    }));

    return (
        <section className="categories-section">

            {/* =========================
                HEADER
            ========================= */}

            <div className="categories-header">

                <span className="categories-label">
                    BRAND BLVD
                </span>

                <h2>
                    Shop by Category
                </h2>

                <p>
                    Find your everyday essentials,
                    redefined.
                </p>

            </div>


            {/* =========================
                CATEGORIES
            ========================= */}

            {loading ? (

                <div className="categories-loading">
                    Loading categories...
                </div>

            ) : categories.length > 0 ? (

                <div className="categories-grid">

                    {categories.map(
                        (category, index) => (

                            <motion.div
                                key={category.name}
                                className="category-card"

                                initial={{
                                    opacity: 0,
                                    y: 35,
                                }}

                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}

                                viewport={{
                                    once: true,
                                    amount: 0.15,
                                }}

                                transition={{
                                    duration: 0.5,
                                    delay:
                                        index * 0.06,
                                }}

                                whileHover={{
                                    y: -6,
                                }}
                            >

                                <Link
                                    to={`/shop?category=${encodeURIComponent(
                                        category.name
                                    )}`}
                                >

                                    <img
                                        src={
                                            category.image
                                        }
                                        alt={
                                            category.name
                                        }

                                        onError={(
                                            event
                                        ) => {
                                            event.currentTarget.src =
                                                FALLBACK_IMAGE;
                                        }}
                                    />

                                    <div className="category-overlay">

                                        <div>

                                            <h3>
                                                {
                                                    category.name
                                                }
                                            </h3>

                                            <span>
                                                Explore

                                                <ArrowRight
                                                    size={
                                                        15
                                                    }
                                                />
                                            </span>

                                        </div>

                                    </div>

                                </Link>

                            </motion.div>

                        )
                    )}

                </div>

            ) : (

                <div className="categories-empty">

                    <h3>
                        Men's collection
                        coming soon
                    </h3>

                    <p>
                        Add men's clothing
                        products from the
                        admin dashboard and
                        your categories will
                        appear here
                        automatically.
                    </p>

                    <Link to="/shop">

                        Explore Shop

                        <ArrowRight
                            size={15}
                        />

                    </Link>

                </div>

            )}

        </section>
    );
}