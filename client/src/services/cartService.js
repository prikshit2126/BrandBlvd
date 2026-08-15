import api from "./api";

const cartService = {
    getCart: () =>
        api.get("/cart"),

    addToCart: (
        productId,
        quantity = 1,
        size = "",
        color = ""
    ) =>
        api.post("/cart", {
            productId,
            quantity,
            size,
            color,
        }),

    updateCart: (
        cartId,
        quantity
    ) =>
        api.put(
            `/cart/${cartId}`,
            {
                quantity,
            }
        ),

    removeCartItem: (
        cartId
    ) =>
        api.delete(
            `/cart/${cartId}`
        ),

    clearCart: () =>
        api.delete("/cart"),
};

export default cartService;