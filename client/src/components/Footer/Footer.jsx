import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="brandblvd-footer">

            <div className="footer-main">

                {/* BRAND */}
                <div className="footer-brand">

                    <Link to="/" className="footer-logo">
                        BrandBlvd
                    </Link>

                    <p>
                        Contemporary menswear designed
                        for everyday confidence.
                    </p>

                    <a
                        href="#"
                        className="footer-instagram"
                    >
                        Instagram
                    </a>

                </div>


                {/* SHOP */}
                <div className="footer-column">

                    <h3>Shop</h3>

                    <Link to="/shop">
                        All Products
                    </Link>

                    <Link to="/shop">
                        New Arrivals
                    </Link>

                    <Link to="/shop">
                        Best Sellers
                    </Link>

                    <Link to="/wishlist">
                        Wishlist
                    </Link>

                </div>


                {/* ACCOUNT */}
                <div className="footer-column">

                    <h3>Account</h3>

                    <Link to="/profile">
                        My Account
                    </Link>

                    <Link to="/orders">
                        My Orders
                    </Link>

                    <Link to="/cart">
                        Cart
                    </Link>

                    <Link to="/wishlist">
                        Wishlist
                    </Link>

                </div>


                {/* HELP */}
                <div className="footer-column">

                    <h3>Help</h3>

                    <Link to="/contact">
                        Contact Us
                    </Link>

                    <Link to="/privacy-policy">
                        Privacy Policy
                    </Link>

                    <Link to="/terms">
                        Terms & Conditions
                    </Link>

                </div>

            </div>


            <div className="footer-bottom">

                <p>
                    © {new Date().getFullYear()} BrandBlvd.
                    All rights reserved.
                </p>

                <p>
                    Contemporary Menswear
                </p>

            </div>

        </footer>
    );
}