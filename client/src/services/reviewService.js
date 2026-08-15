import api from "./api";

const reviewService = {
    // =========================================
    // GET ALL REVIEWS FOR A PRODUCT
    // GET /api/reviews/:productId
    // =========================================
    getProductReviews: (productId) =>
        api.get(`/reviews/${productId}`),

    // =========================================
    // ADD REVIEW
    // POST /api/reviews
    // =========================================
    addReview: (productId, rating, comment) =>
        api.post("/reviews", {
            productId,
            rating,
            comment,
        }),

    // =========================================
    // UPDATE REVIEW
    // PUT /api/reviews/:id
    // =========================================
    updateReview: (reviewId, rating, comment) =>
        api.put(`/reviews/${reviewId}`, {
            rating,
            comment,
        }),

    // =========================================
    // DELETE REVIEW
    // DELETE /api/reviews/:id
    // =========================================
    deleteReview: (reviewId) =>
        api.delete(`/reviews/${reviewId}`),
};

export default reviewService;