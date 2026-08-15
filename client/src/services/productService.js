import api from "./api";

const productService = {

    getAllProducts: (params) =>
        api.get("/products", { params }),

    getFeaturedProducts: () =>
        api.get("/products", {
            params: {
                featured: true
            }
        }),

    getProduct: (id) =>
        api.get(`/products/${id}`)

};

export default productService;