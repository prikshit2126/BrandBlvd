import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../../services/api";

import "./AdminProducts.css";

export default function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/products?limit=100"
      );

      if (response.data?.success) {
        setProducts(
          response.data.products || []
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setDeleting(productId);

      await api.delete(
        `/products/${productId}`
      );

      setProducts((current) =>
        current.filter(
          (product) =>
            product._id !== productId
        )
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to delete product."
      );
    } finally {
      setDeleting(null);
    }
  };

  const filteredProducts = products.filter(
    (product) => {
      const searchText =
        `${product.name} ${product.category} ${product.brand}`
          .toLowerCase();

      return searchText.includes(
        search.toLowerCase()
      );
    }
  );

  return (
    <main className="admin-products-page">

      {/* Header */}

      <header className="admin-products-topbar">

        <Link
          to="/admin"
          className="admin-products-logo"
        >
          BrandBlvd
        </Link>

        <Link
          to="/admin"
          className="admin-products-dashboard"
        >
          Admin Dashboard
        </Link>

      </header>

      <div className="admin-products-container">

        {/* Page heading */}

        <motion.div
          className="admin-products-heading"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >

          <div>

            <button
              type="button"
              className="admin-products-back"
              onClick={() =>
                navigate("/admin")
              }
            >
              <ArrowLeft size={15} />
              Dashboard
            </button>

            <span>
              INVENTORY MANAGEMENT
            </span>

            <h1>
              Products
            </h1>

            <p>
              Manage your men's clothing
              collection.
            </p>

          </div>

          <Link
            to="/admin/products/new"
            className="admin-products-add"
          >
            <Plus size={17} />
            Add Product
          </Link>

        </motion.div>

        {/* Toolbar */}

        <div className="admin-products-toolbar">

          <div className="admin-products-count">
            <Package size={16} />

            <span>
              {loading
                ? "Loading..."
                : `${products.length} products`}
            </span>
          </div>

          <div className="admin-products-search">

            <Search size={16} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="admin-products-error">
            {error}
          </div>
        )}

        {/* Products */}

        {loading ? (
          <div className="admin-products-empty">
            <Package size={30} />

            <h3>
              Loading products...
            </h3>
          </div>
        ) : filteredProducts.length ===
          0 ? (
          <div className="admin-products-empty">

            <Package size={35} />

            <h3>
              {products.length === 0
                ? "No products yet"
                : "No products found"}
            </h3>

            <p>
              {products.length === 0
                ? "Add your first men's clothing product."
                : "Try a different search."}
            </p>

            {products.length === 0 && (
              <Link
                to="/admin/products/new"
                className="admin-products-empty-button"
              >
                <Plus size={15} />
                Add Product
              </Link>
            )}

          </div>
        ) : (
          <div className="admin-products-table">

            {/* Table heading */}

            <div className="admin-products-table-head">
              <span>PRODUCT</span>
              <span>CATEGORY</span>
              <span>PRICE</span>
              <span>STOCK</span>
              <span>STATUS</span>
              <span>ACTION</span>
            </div>

            {filteredProducts.map(
              (product) => {

                const stock =
                  Number(
                    product.stock || 0
                  );

                const threshold =
                  Number(
                    product.lowStockThreshold ??
                      5
                  );

                const isLowStock =
                  stock <= threshold;

                return (
                  <motion.div
                    className="admin-product-table-row"
                    key={product._id}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                  >

                    {/* Product */}

                    <div className="admin-product-cell product-cell">

                      <div className="admin-product-thumb">

                        {product.images?.[0] ? (
                          <img
                            src={
                              product.images[0]
                            }
                            alt={
                              product.name
                            }
                          />
                        ) : (
                          <Package
                            size={20}
                          />
                        )}

                      </div>

                      <div>
                        <strong>
                          {product.name}
                        </strong>

                        <small>
                          {product.brand ||
                            "BrandBlvd"}
                        </small>
                      </div>

                    </div>

                    {/* Category */}

                    <div className="admin-product-cell">
                      <span>
                        {product.category}
                      </span>
                    </div>

                    {/* Price */}

                    <div className="admin-product-cell">
                      <strong>
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                    {/* Stock */}

                    <div className="admin-product-cell">
                      <span
                        className={
                          isLowStock
                            ? "stock-low"
                            : "stock-good"
                        }
                      >
                        {stock}
                      </span>
                    </div>

                    {/* Status */}

                    <div className="admin-product-cell">

                      <span
                        className={
                          product.isFeatured
                            ? "product-status featured"
                            : "product-status"
                        }
                      >
                        {product.isFeatured
                          ? "Featured"
                          : "Active"}
                      </span>

                    </div>

                    {/* Actions */}

                    <div className="admin-product-actions">

                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        title="Edit product"
                        className="product-edit"
                      >
                        <Edit3 size={16} />
                      </Link>

                      <button
                        type="button"
                        title="Delete product"
                        className="product-delete"
                        disabled={
                          deleting ===
                          product._id
                        }
                        onClick={() =>
                          handleDelete(
                            product._id
                          )
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>
        )}

      </div>

    </main>
  );
}