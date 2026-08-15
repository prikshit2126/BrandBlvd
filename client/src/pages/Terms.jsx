import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./Terms.css";

export default function Terms() {
    return (
        <>
            <Navbar />

            <main className="legal-page">

                <div className="legal-header">
                    <span>BRAND BLVD</span>

                    <h1>Terms & Conditions</h1>

                    <p>
                        These terms explain the rules and conditions
                        that apply when you use the BrandBlvd website
                        and purchase our products.
                    </p>

                    <small>Last updated: August 2026</small>
                </div>


                <div className="legal-content">

                    <section>
                        <h2>1. Introduction</h2>

                        <p>
                            Welcome to BrandBlvd. By accessing or using
                            our website, you agree to comply with these
                            Terms & Conditions.
                        </p>

                        <p>
                            If you do not agree with these terms, please
                            do not use the website or place an order.
                        </p>
                    </section>


                    <section>
                        <h2>2. Products</h2>

                        <p>
                            We make reasonable efforts to display product
                            descriptions, images, sizes, colors and
                            prices accurately.
                        </p>

                        <p>
                            However, product colors may appear slightly
                            different depending on your device or screen.
                        </p>

                        <p>
                            Product availability may change without
                            notice.
                        </p>
                    </section>


                    <section>
                        <h2>3. Prices</h2>

                        <p>
                            All prices displayed on the website are
                            subject to change without prior notice.
                        </p>

                        <p>
                            We reserve the right to correct pricing,
                            product information or promotional errors.
                        </p>
                    </section>


                    <section>
                        <h2>4. Orders</h2>

                        <p>
                            When you place an order, you are submitting
                            a request to purchase the selected products.
                        </p>

                        <p>
                            BrandBlvd reserves the right to accept,
                            cancel or limit an order where necessary,
                            including situations involving product
                            availability, pricing errors or suspected
                            fraudulent activity.
                        </p>
                    </section>


                    <section>
                        <h2>5. Payments</h2>

                        <p>
                            Orders must be paid using the payment methods
                            made available during checkout.
                        </p>

                        <p>
                            Payment processing may be handled by
                            third-party payment providers.
                        </p>
                    </section>


                    <section>
                        <h2>6. Shipping & Delivery</h2>

                        <p>
                            Delivery times may vary depending on the
                            destination, shipping provider, product
                            availability and other circumstances.
                        </p>

                        <p>
                            BrandBlvd is not responsible for delays
                            caused by circumstances outside our reasonable
                            control.
                        </p>
                    </section>


                    <section>
                        <h2>7. Returns & Refunds</h2>

                        <p>
                            Returns, exchanges and refunds are subject
                            to the applicable BrandBlvd return policy.
                        </p>

                        <p>
                            Customers should review the applicable return
                            instructions before sending a product back.
                        </p>
                    </section>


                    <section>
                        <h2>8. User Accounts</h2>

                        <p>
                            If you create an account, you are responsible
                            for keeping your login information secure and
                            for activities performed through your account.
                        </p>

                        <p>
                            You should notify BrandBlvd if you believe
                            your account has been accessed without
                            authorization.
                        </p>
                    </section>


                    <section>
                        <h2>9. Website Use</h2>

                        <p>
                            You agree not to misuse the website,
                            interfere with its operation, attempt
                            unauthorized access or use the website for
                            unlawful purposes.
                        </p>
                    </section>


                    <section>
                        <h2>10. Intellectual Property</h2>

                        <p>
                            BrandBlvd website content, including text,
                            graphics, logos, images, design elements and
                            other materials, may be protected by
                            applicable intellectual property laws.
                        </p>

                        <p>
                            Content should not be copied, reproduced,
                            distributed or commercially exploited without
                            appropriate authorization.
                        </p>
                    </section>


                    <section>
                        <h2>11. Limitation of Liability</h2>

                        <p>
                            To the extent permitted by applicable law,
                            BrandBlvd will not be responsible for losses
                            arising from circumstances outside its
                            reasonable control or from temporary
                            interruptions of the website.
                        </p>
                    </section>


                    <section>
                        <h2>12. Changes to These Terms</h2>

                        <p>
                            BrandBlvd may update these Terms & Conditions
                            from time to time. Updated terms will be
                            published on this page.
                        </p>
                    </section>


                    <section>
                        <h2>13. Contact</h2>

                        <p>
                            If you have questions regarding these Terms
                            & Conditions, please contact BrandBlvd.
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