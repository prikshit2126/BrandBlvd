import { useEffect, useMemo, useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar/Navbar";
import ProductCard from "../components/ProductCard/ProductCard";
import { useProducts } from "../hooks/useProducts";

import "./Shop.css";
const MEN_CLOTHING_CATEGORIES = [
  "T-Shirts",
  "Shirts",
  "Jeans",
  "Trousers",
  "Cargo Pants",
  "Shorts",
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, loading, error } = useProducts();

  const [mobileFilters, setMobileFilters] = useState(false);

  const searchFromUrl = searchParams.get("search") || "";
  const categoryFromUrl =
    searchParams.get("category") || "";

  const sortFromUrl =
    searchParams.get("sort") || "featured";

  const [search, setSearch] = useState(searchFromUrl);
  const [category, setCategory] =
    useState(categoryFromUrl);

  const [sort, setSort] =
    useState(sortFromUrl);

  const [maxPrice, setMaxPrice] = useState(10000);

  useEffect(() => {
    setSearch(searchFromUrl);
    setCategory(categoryFromUrl);
    setSort(sortFromUrl);
  }, [
    searchFromUrl,
    categoryFromUrl,
    sortFromUrl,
  ]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return uniqueCategories.sort();
  }, [products]);

  const highestPrice = useMemo(() => {
    if (!products.length) return 10000;

    return Math.max(
      ...products.map(
        (product) => Number(product.price) || 0
      )
    );
  }, [products]);

  useEffect(() => {
    if (highestPrice > 0) {
      setMaxPrice(highestPrice);
    }
  }, [highestPrice]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const keyword = search
        .trim()
        .toLowerCase();

      result = result.filter((product) => {
        return (
          product.name
            ?.toLowerCase()
            .includes(keyword) ||
          product.description
            ?.toLowerCase()
            .includes(keyword) ||
          product.brand
            ?.toLowerCase()
            .includes(keyword) ||
          product.category
            ?.toLowerCase()
            .includes(keyword)
        );
      });
    }

    // Category
    if (category) {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    // Price
    result = result.filter(
      (product) =>
        Number(product.price || 0) <= maxPrice
    );

    // Sort
    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    if (sort === "bestselling") {
      result.sort(
        (a, b) =>
          Number(b.sold || 0) -
          Number(a.sold || 0)
      );
    }

    if (sort === "featured") {
      result.sort(
        (a, b) =>
          Number(Boolean(b.isFeatured)) -
          Number(Boolean(a.isFeatured))
      );
    }

    return result;
  }, [
    products,
    search,
    category,
    maxPrice,
    sort,
  ]);

  const updateFilters = ({
    newSearch = search,
    newCategory = category,
    newSort = sort,
  } = {}) => {
    const params = new URLSearchParams();

    if (newSearch.trim()) {
      params.set(
        "search",
        newSearch.trim()
      );
    }

    if (newCategory) {
      params.set(
        "category",
        newCategory
      );
    }

    if (newSort !== "featured") {
      params.set("sort", newSort);
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("featured");

    setMaxPrice(highestPrice);

    setSearchParams({});
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    updateFilters({
      newSearch: search,
    });
  };

  return (
    <>
      <Navbar />

      <main className="shop-page">

        {/* Header */}
        <section className="shop-hero">

          <div>
            <span className="shop-eyebrow">
              BRAND BLVD / MEN
            </span>

            <h1>Shop Men's Fashion</h1>

            <p>
              Elevated essentials and modern
              silhouettes made for everyday style.
            </p>
          </div>

        </section>

        {/* Toolbar */}
        <section className="shop-toolbar">

          <button
            type="button"
            className="mobile-filter-button"
            onClick={() =>
              setMobileFilters(true)
            }
          >
            <Filter size={17} />
            Filters
          </button>

          <span className="product-count">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "Product"
              : "Products"}
          </span>

          <div className="sort-wrapper">
            <label htmlFor="sort">
              Sort by
            </label>

            <select
              id="sort"
              value={sort}
              onChange={(event) => {
                const value =
                  event.target.value;

                setSort(value);

                updateFilters({
                  newSort: value,
                });
              }}
            >
              <option value="featured">
                Featured
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="bestselling">
                Best Sellers
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>
            </select>
          </div>

        </section>

        <div className="shop-layout">

          {/* Filters */}
          <aside
            className={`shop-filters ${
              mobileFilters
                ? "shop-filters-open"
                : ""
            }`}
          >

            <div className="filters-header">
              <h2>Filters</h2>

              <button
                type="button"
                onClick={() =>
                  setMobileFilters(false)
                }
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="filter-group">

              <h3>Search</h3>

              <form
                className="shop-search"
                onSubmit={
                  handleSearchSubmit
                }
              >
                <Search size={17} />

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
              </form>

            </div>

            {/* Category */}
            <div className="filter-group">

              <h3>Category</h3>

              <button
                type="button"
                className={
                  !category
                    ? "category-filter active"
                    : "category-filter"
                }
                onClick={() => {
                  setCategory("");
                  updateFilters({
                    newCategory: "",
                  });
                }}
              >
                All Products
              </button>

              {categories.map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    className={
                      category === item
                        ? "category-filter active"
                        : "category-filter"
                    }
                    onClick={() => {
                      setCategory(item);

                      updateFilters({
                        newCategory:
                          item,
                      });

                      setMobileFilters(
                        false
                      );
                    }}
                  >
                    {item}
                  </button>
                )
              )}

            </div>

            {/* Price */}
            <div className="filter-group">

              <div className="price-heading">
                <h3>Maximum Price</h3>

                <span>
                  ₹
                  {Number(
                    maxPrice
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <input
                className="price-range"
                type="range"
                min="0"
                max={highestPrice || 10000}
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(
                    Number(
                      event.target.value
                    )
                  )
                }
              />

            </div>

            <button
              type="button"
              className="clear-filters"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>

          </aside>

          {mobileFilters && (
            <div
              className="filter-backdrop"
              onClick={() =>
                setMobileFilters(false)
              }
            />
          )}

          {/* Products */}
          <section className="shop-products">

            {loading ? (
              <div className="shop-loading">

                {Array.from({
                  length: 8,
                }).map((_, index) => (
                  <div
                    className="product-skeleton"
                    key={index}
                  >
                    <div className="skeleton-image" />

                    <div className="skeleton-line" />

                    <div className="skeleton-small" />
                  </div>
                ))}

              </div>
            ) : error ? (
              <div className="shop-message">

                <h2>
                  Couldn't load products
                </h2>

                <p>{error}</p>

              </div>
            ) : filteredProducts.length ===
              0 ? (
              <div className="shop-message">

                <h2>
                  No products found
                </h2>

                <p>
                  Try changing your search
                  or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

              </div>
            ) : (
              <motion.div
                className="shop-grid"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  )
                )}
              </motion.div>
            )}

          </section>

        </div>

      </main>
    </>
  );
}