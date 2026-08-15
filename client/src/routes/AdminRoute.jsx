import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
    const token = localStorage.getItem("token");

    let user = null;

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "null"
        );
    } catch (error) {
        console.error(
            "Invalid user data in localStorage:",
            error
        );
    }

    // ============================================
    // NOT LOGGED IN
    // ============================================

    if (!token) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }

    // ============================================
    // NOT AN ADMIN
    // ============================================

    if (user?.role !== "admin") {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    // ============================================
    // ADMIN AUTHORIZED
    // ============================================

    return <Outlet />;
}