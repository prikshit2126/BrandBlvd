import api from "./api";

const wishlistService = {
  getWishlist: () =>
    api.get("/wishlist"),

  addToWishlist: (productId) =>
    api.post("/wishlist", {
      productId,
    }),

  removeWishlist: (wishlistId) =>
    api.delete(`/wishlist/${wishlistId}`),
};

export default wishlistService;