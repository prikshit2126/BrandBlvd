import { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./Contact.css";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmitted(true);

        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    };

    return (
        <>
            <Navbar />

            <main className="contact-page">

                {/* HERO */}
                <section className="contact-hero">

                    <span className="contact-label">
                        BRAND BLVD
                    </span>

                    <h1>
                        Let's talk.
                    </h1>

                    <p>
                        Have a question about an order, product,
                        delivery or anything else? We're here to help.
                    </p>

                </section>


                {/* CONTACT CONTENT */}
                <section className="contact-content">

                    {/* LEFT */}
                    <div className="contact-info">

                        <span className="contact-small-label">
                            GET IN TOUCH
                        </span>

                        <h2>
                            We'd love to
                            <br />
                            hear from you.
                        </h2>

                        <p className="contact-description">
                            Whether you need help with your order,
                            want to know more about a product, or simply
                            want to say hello, send us a message.
                        </p>


                        {/* EMAIL */}
                        <div className="contact-detail">

                            <div className="contact-icon">
                                <Mail size={18} />
                            </div>

                            <div>
                                <span>Email</span>

                                <a href="mailto:hello@brandblvd.com">
                                    hello@brandblvd.com
                                </a>
                            </div>

                        </div>


                        {/* PHONE */}
                        <div className="contact-detail">

                            <div className="contact-icon">
                                <Phone size={18} />
                            </div>

                            <div>
                                <span>Phone</span>

                                <a href="tel:+919999999999">
                                    +91 99999 99999
                                </a>
                            </div>

                        </div>


                        {/* LOCATION */}
                        <div className="contact-detail">

                            <div className="contact-icon">
                                <MapPin size={18} />
                            </div>

                            <div>
                                <span>Location</span>

                                <p>
                                    Punjab, India
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* FORM */}
                    <div className="contact-form-wrapper">

                        {submitted ? (

                            <div className="contact-success">

                                <div className="success-icon">
                                    ✓
                                </div>

                                <h3>
                                    Message sent.
                                </h3>

                                <p>
                                    Thank you for contacting BrandBlvd.
                                    We'll get back to you as soon as possible.
                                </p>

                                <button
                                    onClick={() => setSubmitted(false)}
                                >
                                    Send another message
                                </button>

                            </div>

                        ) : (

                            <form
                                className="contact-form"
                                onSubmit={handleSubmit}
                            >

                                <div className="form-row">

                                    <div className="form-group">

                                        <label htmlFor="name">
                                            Your Name
                                        </label>

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label htmlFor="email">
                                            Email Address
                                        </label>

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                </div>


                                <div className="form-group">

                                    <label htmlFor="subject">
                                        Subject
                                    </label>

                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        placeholder="What can we help you with?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label htmlFor="message">
                                        Message
                                    </label>

                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="7"
                                        placeholder="Write your message..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <button
                                    className="contact-submit"
                                    type="submit"
                                >
                                    Send Message

                                    <ArrowRight size={17} />

                                </button>

                            </form>

                        )}

                    </div>

                </section>


                {/* FAQ STRIP */}
                <section className="contact-bottom">

                    <span>
                        NEED QUICK HELP?
                    </span>

                    <h2>
                        Check your orders,
                        <br />
                        account or wishlist.
                    </h2>

                    <div className="contact-links">

                        <a href="/orders">
                            My Orders →
                        </a>

                        <a href="/profile">
                            My Account →
                        </a>

                        <a href="/wishlist">
                            Wishlist →
                        </a>

                    </div>

                </section>

            </main>

            <Footer />
        </>
    );
}