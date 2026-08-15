import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts";
import Categories from "../components/Categories/Categories";
import ProductSection from "../components/ProductSection/ProductSection";
import Footer from "../components/Footer/Footer";

export default function Home() {
    return (
        <>
            <Navbar />

            <Hero />

            <FeaturedProducts />

            <Categories />

            <ProductSection
                title="New Arrivals"
                subtitle="Fresh pieces, just added to the collection."
                type="new"
            />

            <ProductSection
                title="Best Sellers"
                subtitle="The pieces our customers keep coming back for."
                type="best"
            />

            <Footer />
        </>
    );
}