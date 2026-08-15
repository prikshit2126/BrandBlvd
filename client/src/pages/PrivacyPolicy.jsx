import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
    return (
        <>
            <Navbar />

            <main className="legal-page">

                <div className="legal-header">
                    <span>BRAND BLVD</span>
                    <h1>Privacy Policy</h1>
                    <p>
                        Your privacy matters to us. This policy explains
                        how BrandBlvd collects, uses and protects your
                        information.
                    </p>
                    <small>Last updated: August 2026</small>
                </div>

                <div className="legal-content">

                    <section>
                        <h2>1. Information We Collect</h2>

                        <p>
                            When you use BrandBlvd, place an order, create
                            an account or contact us, we may collect
                            information such as:
                        </p>

                        <ul>
                            <li>Name and contact information</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Shipping and billing address</li>
                            <li>Order and purchase information</li>
                            <li>Account information</li>
                            <li>Information you provide when contacting us</li>
                        </ul>
                    </section>


                    <section>
                        <h2>2. How We Use Your Information</h2>

                        <p>
                            We may use the information we collect to:
                        </p>

                        <ul>
                            <li>Process and deliver your orders</li>
                            <li>Manage your BrandBlvd account</li>
                            <li>Provide customer support</li>
                            <li>Process payments and refunds</li>
                            <li>Send order confirmations and updates</li>
                            <li>Improve our website and services</li>
                            <li>Prevent fraud and unauthorized activity</li>
                            <li>Send promotional communications where permitted</li>
                        </ul>
                    </section>


                    <section>
                        <h2>3. Payment Information</h2>

                        <p>
                            Payments may be processed through third-party
                            payment providers. BrandBlvd does not intend
                            to store complete payment card information on
                            its own servers.
                        </p>

                        <p>
                            Payment information may be handled by the
                            applicable payment service provider according
                            to its own privacy policy and security
                            practices.
                        </p>
                    </section>


                    <section>
                        <h2>4. Cookies</h2>

                        <p>
                            BrandBlvd may use cookies and similar
                            technologies to maintain sessions, remember
                            preferences, improve website functionality
                            and understand how visitors use our website.
                        </p>
                    </section>


                    <section>
                        <h2>5. Sharing Information</h2>

                        <p>
                            We do not sell your personal information.
                            Information may be shared with trusted
                            service providers when necessary to operate
                            our business, including payment processing,
                            shipping, hosting and technical services.
                        </p>
                    </section>


                    <section>
                        <h2>6. Data Security</h2>

                        <p>
                            We take reasonable measures to protect the
                            information provided to us. However, no
                            internet transmission or electronic storage
                            system can be guaranteed to be completely
                            secure.
                        </p>
                    </section>


                    <section>
                        <h2>7. Your Choices</h2>

                        <p>
                            You may contact us regarding your personal
                            information, request corrections to
                            inaccurate information or ask questions about
                            how your information is used.
                        </p>
                    </section>


                    <section>
                        <h2>8. Children's Privacy</h2>

                        <p>
                            BrandBlvd is intended for general consumers
                            and is not knowingly directed toward children.
                            We do not intentionally collect personal
                            information from children.
                        </p>
                    </section>


                    <section>
                        <h2>9. Changes to This Policy</h2>

                        <p>
                            We may update this Privacy Policy from time
                            to time. Any changes will be posted on this
                            page with an updated revision date.
                        </p>
                    </section>


                    <section>
                        <h2>10. Contact Us</h2>

                        <p>
                            If you have questions about this Privacy
                            Policy or your personal information, please
                            contact BrandBlvd through our contact page.
                        </p>

                        <Link
                            to="/contact"
                            className="legal-button"
                        >
                            Contact BrandBlvd
                        </Link>
                    </section>

                </div>

            </main>

            <Footer />
        </>
    );
}