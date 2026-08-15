import api from "./api";

const adminProductService = {
  createProduct: (formData) =>
    api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateProduct: (id, data) =>
    api.put(`/products/${id}`, data),

  deleteProduct: (id) =>
    api.delete(`/products/${id}`),
};

export default adminProductService;