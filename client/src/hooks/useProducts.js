import { useCallback, useEffect, useState } from "react";
import productService from "../services/productService";

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await productService.getAllProducts(params);

      const data = response.data;

      setProducts(
        Array.isArray(data)
          ? data
          : data.products || data.data || []
      );
    } catch (err) {
      console.error("Failed to fetch products:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load products"
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}       