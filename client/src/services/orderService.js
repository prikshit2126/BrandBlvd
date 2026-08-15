import api from "./api";

const orderService = {

    // =====================================================
    // CUSTOMER
    // =====================================================

    placeOrder: (orderData) =>
        api.post("/orders", orderData),

    getMyOrders: () =>
        api.get("/orders"),


    // =====================================================
    // ADMIN
    // =====================================================

    getAllOrders: () =>
        api.get("/orders/admin/all"),


    updateOrderStatus: (
        orderId,
        status
    ) =>
        api.put(
            `/orders/admin/${orderId}`,
            {
                status,
            }
        ),


    // =====================================================
    // ADMIN - PAYMENT
    // =====================================================

    updatePaymentStatus: (
        orderId,
        paymentStatus
    ) =>
        api.put(
            `/orders/admin/${orderId}/payment`,
            {
                paymentStatus,
            }
        ),
};

export default orderService;