import api from "./api";

const couponService = {
    // ================================
    // ADMIN
    // ================================

    getAllCoupons: () =>
        api.get("/coupons/admin/all"),

    getCouponById: (id) =>
        api.get(`/coupons/admin/${id}`),

    createCoupon: (couponData) =>
        api.post("/coupons/admin", couponData),

    updateCoupon: (id, couponData) =>
        api.put(`/coupons/admin/${id}`, couponData),

    toggleCoupon: (id) =>
        api.put(`/coupons/admin/${id}/toggle`),

    deleteCoupon: (id) =>
        api.delete(`/coupons/admin/${id}`),

    // ================================
    // CUSTOMER
    // ================================

    validateCoupon: (code, orderAmount) =>
        api.post("/coupons/validate", {
            code,
            orderAmount,
        }),
};

export default couponService;