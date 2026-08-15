import "./Hero.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import heroVideo from "../../assets/videos/hero.mp4";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">

      <video
        autoPlay
        muted
        loop
        playsInline
        className="hero-video"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      <div className="overlay"></div>

      <div className="hero-content">

        <motion.h1
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          BRAND BLVD
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          DEFINED BY STYLE.  DRIVEN WITH VISION.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            className="shop-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/shop")}
          >
            Shop Now
          </motion.button>

          <motion.button
            className="explore-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Play size={18} />
            Explore
          </motion.button>

        </motion.div>

      </div>

      <div className="scroll-indicator">
        Scroll
      </div>

    </section>
  );
}