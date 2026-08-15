import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "../ProductCard/ProductCard";
import { useProducts } from "../../hooks/useProducts";
import "./ProductSection.css";

export default function ProductSection({
  title,
  subtitle,
  type = "new",
}) {
  const { products, loading } = useProducts();

  let sectionProducts = [...(products || [])];

  if (type === "new") {
    sectionProducts.sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    );
  }

  if (type === "best") {
    sectionProducts.sort(
      (a, b) => (b.sold || 0) - (a.sold || 0)
    );
  }

  sectionProducts = sectionProducts.slice(0, 4);

  return (
    <section className="product-section">
      <div className="product-section-header">
        <div>
          <span className="product-section-label">
            BRAND BLVD
          </span>

          <h2>{title}</h2>

          <p>{subtitle}</p>
        </div>

        <Link
          to="/shop"
          className="product-section-link"
        >
          Shop All
          <ArrowRight size={17} />
        </Link>
      </div>

      {loading ? (
        <div className="section-loading">
          Loading...
        </div>
      ) : sectionProducts.length > 0 ? (
        <div className="section-product-grid">
          {sectionProducts.map((product, index) => (
            <motion.div
              key={product._id}
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
                amount: 0.1,
              }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="section-empty">
          <p>
            Products will appear here once they are added
            to BrandBlvd.
          </p>
        </div>
      )}
    </section>
  );
}