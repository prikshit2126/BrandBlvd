import "./FeaturedCollections.css";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import men from "../../assets/images/men.jpg";
import women from "../../assets/images/women.jpg";
import accessories from "../../assets/images/accessories.jpg";

export default function FeaturedCollections() {
  const collections = [
    {
      title: "Men Collection",
      image: men,
      category: "Men",
    },
    {
      title: "Women Collection",
      image: women,
      category: "Women",
    },
    {
      title: "Accessories",
      image: accessories,
      category: "Accessories",
      wide: true,
    },
  ];

  return (
    <section className="collections">

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Featured Collections
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Curated luxury collections for every style.
      </motion.p>

      <div className="collection-grid">

        {collections.map((item, index) => (

          <motion.div
            key={index}
            className={`collection-card ${item.wide ? "wide" : ""}`}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * .2 }}
            viewport={{ once: true }}
          >

            <img src={item.image} alt="" />

            <div className="collection-overlay">

              <h3>{item.title}</h3>

              <Link to={`/shop?category=${item.category}`}>
                Explore
                <ArrowRight size={18} />
              </Link>

            </div>

          </motion.div>

        ))}

      </div>

    </section>
  );
}