import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "../ProductCard/ProductCard";
import { useProducts } from "../../hooks/useProducts";
import "./FeaturedProducts.css";

export default function FeaturedProducts() {
  const { products, loading } = useProducts();

  const featuredProducts = products
    ?.filter((product) => product.featured || product.isFeatured)
    .slice(0, 8);

  return (
    <section className="featured-products">
      <div className="featured-header">
        <div>
          <span className="section-label">
            BRAND BLVD
          </span>

          <h2>Trending Now</h2>

          <p>
            The styles everyone is wearing right now.
          </p>
        </div>

        <Link to="/shop" className="view-all">
          View All
          <ArrowRight size={17} />
        </Link>
      </div>

      {loading ? (
        <div className="products-loading">
          Loading products...
        </div>
      ) : featuredProducts?.length > 0 ? (
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="products-empty">
          <h3>No featured products yet</h3>
          <p>
            Add featured men's clothing from your admin
            dashboard and they'll appear here automatically.
          </p>

          <Link to="/shop">
            Explore Shop
          </Link>
        </div>
      )}
    </section>
  );
}