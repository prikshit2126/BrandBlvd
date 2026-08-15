import { Routes, Route } from "react-router-dom";

/* =========================================================
   CUSTOMER PAGES
========================================================= */

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";


/* =========================================================
   ADMIN PAGES
========================================================= */

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import Coupons from "./pages/admin/Coupons";
import Customers from "./pages/admin/Customers";


/* =========================================================
   ROUTE PROTECTION
========================================================= */

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";


export default function App() {
    return (
        <Routes>

            {/* =================================================
                PUBLIC AUTHENTICATION
            ================================================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* =================================================
                ADMIN LOGIN
            ================================================= */}

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />


            {/* =================================================
                PUBLIC CUSTOMER PAGES
            ================================================= */}

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/shop"
                element={<Shop />}
            />

            <Route
                path="/product/:id"
                element={<ProductDetails />}
            />

            <Route
                path="/cart"
                element={<Cart />}
            />


            {/* =================================================
                CUSTOMER PROTECTED PAGES
            ================================================= */}

            <Route element={<ProtectedRoute />}>

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/wishlist"
                    element={<Wishlist />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/orders"
                    element={<Orders />}
                />
                <Route path="/contact"
                    element={<Contact />}
                />

                <Route
                    path="/privacy-policy"
                    element={<PrivacyPolicy />}
                />

                <Route
                    path="/terms"
                    element={<Terms />}
                />

            </Route>


            {/* =================================================
                ADMIN PROTECTED PAGES
            ================================================= */}

            <Route element={<AdminRoute />}>

                {/* Dashboard */}

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />


                {/* Products */}

                <Route
                    path="/admin/products"
                    element={<AdminProducts />}
                />

                <Route
                    path="/admin/products/new"
                    element={<AddProduct />}
                />

                <Route
                    path="/admin/products/edit/:id"
                    element={<EditProduct />}
                />


                {/* Orders */}

                <Route
                    path="/admin/orders"
                    element={<AdminOrders />}
                />


                {/* Coupons */}

                <Route
                    path="/admin/coupons"
                    element={<Coupons />}
                />

                <Route
                    path="/admin/customers"
                    element={<Customers />}
                />

            </Route>


            {/* =================================================
                FALLBACK
            ================================================= */}

            <Route
                path="*"
                element={<Home />}
            />

        </Routes>
    );
}