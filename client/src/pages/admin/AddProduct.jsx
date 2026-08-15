import { useState } from "react";
import { ArrowLeft, ImagePlus, X, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../../components/Navbar/Navbar";
import adminProductService from "../../services/adminProductService";

import "./AddProduct.css";


/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES = [
    "T-Shirts",
    "Shirts",
    "Polo Shirts",
    "Hoodies",
    "Sweatshirts",
    "Jackets",
    "Jeans",
    "Trousers",
    "Cargo Pants",
    "Shorts",
    "Tracksuits",
];


/* =========================================================
   SIZES
========================================================= */

const SIZES = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "3XL",
];


/* =========================================================
   COLORS
========================================================= */

const COLORS = [
    "Black",
    "White",
    "Grey",
    "Navy",
    "Beige",
    "Brown",
    "Green",
    "Red",
];


/* =========================================================
   INITIAL FORM
========================================================= */

const INITIAL_FORM = {
    name: "",
    description: "",

    // CURRENT / SALE PRICE
    price: "",

    // ORIGINAL / COMPARE / MRP PRICE
    originalPrice: "",

    category: "",
    brand: "BrandBlvd",

    stock: "",
    lowStockThreshold: "5",

    sizes: [],
    colors: [],

    isVisible: true,
    isFeatured: false,
};


export default function AddProduct() {

    const navigate = useNavigate();


    /* =====================================================
       STATE
    ===================================================== */

    const [form, setForm] = useState(INITIAL_FORM);

    const [customColor, setCustomColor] =
        useState("");

    const [images, setImages] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    /* =====================================================
       SALE CALCULATION
    ===================================================== */

    const sellingPrice =
        Number(form.price) || 0;

    const originalPrice =
        Number(form.originalPrice) || 0;


    const isOnSale =
        originalPrice > sellingPrice &&
        sellingPrice > 0;


    const salePercentage =
        isOnSale
            ? Math.round(
                ((originalPrice -
                    sellingPrice) /
                    originalPrice) *
                100
            )
            : 0;


    /* =====================================================
       CHANGE HANDLER
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;


        setForm((current) => ({
            ...current,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));


        setError("");
        setMessage("");
    };


    /* =====================================================
       IMAGE HANDLER
    ===================================================== */

    const handleImages = (event) => {

        const selected =
            Array.from(
                event.target.files || []
            );


        if (selected.length > 5) {

            setError(
                "You can upload a maximum of 5 images."
            );

            return;
        }


        setImages(selected);

        setError("");
        setMessage("");
    };


    /* =====================================================
       REMOVE IMAGE
    ===================================================== */

    const removeImage = (index) => {

        setImages((current) =>
            current.filter(
                (_, imageIndex) =>
                    imageIndex !== index
            )
        );
    };


    /* =====================================================
       CUSTOM COLOR
    ===================================================== */

    const addCustomColor = () => {

        const color =
            customColor.trim();


        if (!color) {
            return;
        }


        const alreadyExists =
            Array.isArray(form.colors) &&
            form.colors.some(
                (item) =>
                    item.toLowerCase() ===
                    color.toLowerCase()
            );


        if (alreadyExists) {

            setCustomColor("");

            return;
        }


        setForm((current) => ({
            ...current,

            colors: [
                ...(Array.isArray(
                    current.colors
                )
                    ? current.colors
                    : []),

                color,
            ],
        }));


        setCustomColor("");
    };


    /* =====================================================
       TOGGLE SIZE
    ===================================================== */

    const toggleSize = (size) => {

        setForm((current) => {

            const sizes =
                Array.isArray(
                    current.sizes
                )
                    ? current.sizes
                    : [];


            return {

                ...current,

                sizes:
                    sizes.includes(size)
                        ? sizes.filter(
                            (item) =>
                                item !== size
                        )
                        : [
                            ...sizes,
                            size,
                        ],
            };
        });
    };


    /* =====================================================
       TOGGLE COLOR
    ===================================================== */

    const toggleColor = (color) => {

        setForm((current) => {

            const colors =
                Array.isArray(
                    current.colors
                )
                    ? current.colors
                    : [];


            return {

                ...current,

                colors:
                    colors.includes(color)
                        ? colors.filter(
                            (item) =>
                                item !== color
                        )
                        : [
                            ...colors,
                            color,
                        ],
            };
        });
    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();


        setError("");
        setMessage("");


        /* =================================================
           IMAGE VALIDATION
        ================================================= */

        if (images.length === 0) {

            setError(
                "Please select at least one product image."
            );

            return;
        }


        if (images.length > 5) {

            setError(
                "You can upload a maximum of 5 images."
            );

            return;
        }


        /* =================================================
           PRICE VALIDATION
        ================================================= */

        if (
            form.price === "" ||
            Number(form.price) <= 0
        ) {

            setError(
                "Please enter a valid sale price."
            );

            return;
        }


        if (
            form.originalPrice !== "" &&
            Number(form.originalPrice) <
            Number(form.price)
        ) {

            setError(
                "Compare price must be equal to or higher than the sale price."
            );

            return;
        }


        try {

            setLoading(true);


            /* =================================================
               FORM DATA
            ================================================= */

            const formData =
                new FormData();


            /* =================================================
               BASIC DETAILS
            ================================================= */

            formData.append(
                "name",
                form.name.trim()
            );


            formData.append(
                "description",
                form.description.trim()
            );


            /* =================================================
               PRICING
            ================================================= */

            // CURRENT / SALE PRICE
            formData.append(
                "price",
                String(
                    Number(form.price)
                )
            );


            // ORIGINAL / COMPARE / MRP PRICE
            //
            // IMPORTANT:
            // Backend expects "originalPrice",
            // NOT "comparePrice".

            formData.append(
                "originalPrice",
                form.originalPrice === ""
                    ? String(
                        Number(
                            form.price
                        )
                    )
                    : String(
                        Number(
                            form.originalPrice
                        )
                    )
            );


            /* =================================================
               PRODUCT DETAILS
            ================================================= */

            formData.append(
                "category",
                form.category
            );


            formData.append(
                "brand",
                form.brand.trim() ||
                "BrandBlvd"
            );


            /* =================================================
               INVENTORY
            ================================================= */

            formData.append(
                "stock",
                form.stock === ""
                    ? "0"
                    : String(
                        Number(
                            form.stock
                        )
                    )
            );


            formData.append(
                "lowStockThreshold",
                form.lowStockThreshold === ""
                    ? "5"
                    : String(
                        Number(
                            form.lowStockThreshold
                        )
                    )
            );


            /* =================================================
               SIZES
            ================================================= */

            formData.append(
                "sizes",
                JSON.stringify(
                    Array.isArray(
                        form.sizes
                    )
                        ? form.sizes
                        : []
                )
            );


            /* =================================================
               COLORS
            ================================================= */

            formData.append(
                "colors",
                JSON.stringify(
                    Array.isArray(
                        form.colors
                    )
                        ? form.colors
                        : []
                )
            );


            /* =================================================
               STORE SETTINGS
            ================================================= */

            formData.append(
                "isVisible",
                String(
                    form.isVisible
                )
            );


            formData.append(
                "isFeatured",
                String(
                    form.isFeatured
                )
            );


            /* =================================================
               IMAGES
            ================================================= */

            images.forEach((image) => {

                formData.append(
                    "images",
                    image
                );
            });


            /* =================================================
               CREATE PRODUCT
            ================================================= */

            const response =
                await adminProductService.createProduct(
                    formData
                );


            /* =================================================
               RESPONSE CHECK
            ================================================= */

            if (
                !response.data?.success
            ) {

                throw new Error(
                    response.data?.message ||
                    "Product could not be created."
                );
            }


            /* =================================================
               SUCCESS
            ================================================= */

            setMessage(
                "Product added successfully."
            );


            /* =================================================
               RESET FORM
            ================================================= */

            setForm({
                ...INITIAL_FORM,

                sizes: [],
                colors: [],
            });


            setCustomColor("");

            setImages([]);


            /* =================================================
               REDIRECT
            ================================================= */

            setTimeout(() => {

                navigate(
                    "/admin",
                    {
                        replace: true,
                    }
                );

            }, 800);


        } catch (err) {

            console.error(
                "Create product error:",
                err
            );


            setError(
                err.response?.data
                    ?.message ||
                err.message ||
                "Unable to create product."
            );


        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <>
            <Navbar />


            <main className="admin-product-page">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="admin-product-header">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin"
                            )
                        }
                        className="admin-back"
                    >
                        <ArrowLeft
                            size={16}
                        />

                        Admin Dashboard
                    </button>


                    <div>

                        <span>
                            BRAND BLVD / ADMIN
                        </span>


                        <h1>
                            Add Product
                        </h1>


                        <p>
                            Add a new piece to the
                            men's collection.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <motion.form

                    className="admin-product-form"

                    onSubmit={
                        handleSubmit
                    }

                    initial={{
                        opacity: 0,
                        y: 20,
                    }}

                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                >


                    {/* =================================================
                        01 BASIC DETAILS
                    ================================================= */}

                    <section className="admin-form-card">

                        <div className="admin-section-title">

                            <span>
                                01
                            </span>


                            <div>

                                <small>
                                    PRODUCT INFORMATION
                                </small>


                                <h2>
                                    Basic Details
                                </h2>

                            </div>

                        </div>


                        <div className="admin-fields">


                            {/* PRODUCT NAME */}

                            <div className="admin-field full">

                                <label>
                                    Product Name
                                </label>


                                <input
                                    name="name"
                                    value={
                                        form.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Premium Oversized T-Shirt"
                                    required
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="admin-field full">

                                <label>
                                    Description
                                </label>


                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Describe the product..."
                                    rows="5"
                                    required
                                />

                            </div>


                            {/* =================================================
                                SALE PRICE
                            ================================================= */}

                            <div className="admin-field">

                                <label>
                                    Sale Price
                                </label>


                                <input
                                    type="number"
                                    name="price"
                                    value={
                                        form.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="999"
                                    min="0"
                                    required
                                />

                            </div>


                            {/* =================================================
                                ORIGINAL PRICE
                            ================================================= */}

                            <div className="admin-field">

                                <label>
                                    Compare-at Price
                                </label>


                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={
                                        form.originalPrice
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="1499"
                                    min="0"
                                />

                            </div>


                            {/* =================================================
                                SALE PREVIEW
                            ================================================= */}

                            {isOnSale && (

                                <div className="admin-sale-preview">

                                    <Tag
                                        size={17}
                                    />


                                    <div>

                                        <strong>
                                            ON SALE
                                        </strong>


                                        <span>
                                            Save{" "}
                                            {
                                                salePercentage
                                            }
                                            %
                                        </span>

                                    </div>

                                </div>
                            )}


                            {/* CATEGORY */}

                            <div className="admin-field">

                                <label>
                                    Category
                                </label>


                                <select
                                    name="category"
                                    value={
                                        form.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select category
                                    </option>


                                    {CATEGORIES.map(
                                        (
                                            category
                                        ) => (

                                            <option
                                                key={
                                                    category
                                                }
                                                value={
                                                    category
                                                }
                                            >
                                                {
                                                    category
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>


                            {/* BRAND */}

                            <div className="admin-field">

                                <label>
                                    Brand
                                </label>


                                <input
                                    name="brand"
                                    value={
                                        form.brand
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="BrandBlvd"
                                />

                            </div>


                            {/* STOCK */}

                            <div className="admin-field">

                                <label>
                                    Stock
                                </label>


                                <input
                                    type="number"
                                    name="stock"
                                    value={
                                        form.stock
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="25"
                                    min="0"
                                    required
                                />

                            </div>


                            {/* LOW STOCK */}

                            <div className="admin-field">

                                <label>
                                    Low Stock Alert
                                </label>


                                <input
                                    type="number"
                                    name="lowStockThreshold"
                                    value={
                                        form.lowStockThreshold
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                />

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        02 IMAGES
                    ================================================= */}

                    <section className="admin-form-card">

                        <div className="admin-section-title">

                            <span>
                                02
                            </span>


                            <div>

                                <small>
                                    PRODUCT IMAGES
                                </small>


                                <h2>
                                    Upload Images
                                </h2>

                            </div>

                        </div>


                        <label className="image-upload">

                            <ImagePlus
                                size={30}
                            />


                            <strong>
                                Choose product images
                            </strong>


                            <span>
                                Upload up to 5 images
                            </span>


                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={
                                    handleImages
                                }
                            />

                        </label>


                        {images.length > 0 && (

                            <div className="image-preview-grid">

                                {images.map(
                                    (
                                        image,
                                        index
                                    ) => (

                                        <div
                                            className="image-preview"
                                            key={`${image.name}-${index}`}
                                        >

                                            <img
                                                src={URL.createObjectURL(
                                                    image
                                                )}
                                                alt={`Preview ${index +
                                                    1
                                                    }`}
                                            />


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(
                                                        index
                                                    )
                                                }
                                            >

                                                <X
                                                    size={16}
                                                />

                                            </button>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </section>


                    {/* =================================================
                        03 OPTIONS
                    ================================================= */}

                    <section className="admin-form-card">

                        <div className="admin-section-title">

                            <span>
                                03
                            </span>


                            <div>

                                <small>
                                    PRODUCT OPTIONS
                                </small>


                                <h2>
                                    Sizes & Colours
                                </h2>

                            </div>

                        </div>


                        {/* SIZES */}

                        <div className="product-option-group">

                            <label>
                                Available Sizes
                            </label>


                            <div className="option-buttons">

                                {SIZES.map(
                                    (size) => (

                                        <button
                                            type="button"
                                            key={size}
                                            className={
                                                (
                                                    Array.isArray(
                                                        form.sizes
                                                    )
                                                        ? form.sizes
                                                        : []
                                                ).includes(
                                                    size
                                                )
                                                    ? "option-button active"
                                                    : "option-button"
                                            }
                                            onClick={() =>
                                                toggleSize(
                                                    size
                                                )
                                            }
                                        >
                                            {size}
                                        </button>
                                    )
                                )}

                            </div>

                        </div>


                        {/* COLOURS */}

                        <div className="product-option-group">

                            <label>
                                Available Colours
                            </label>


                            <div className="option-buttons">

                                {COLORS.map(
                                    (color) => (

                                        <button
                                            type="button"
                                            key={color}
                                            className={
                                                (
                                                    Array.isArray(
                                                        form.colors
                                                    )
                                                        ? form.colors
                                                        : []
                                                ).includes(
                                                    color
                                                )
                                                    ? "option-button active"
                                                    : "option-button"
                                            }
                                            onClick={() =>
                                                toggleColor(
                                                    color
                                                )
                                            }
                                        >
                                            {color}
                                        </button>
                                    )
                                )}

                            </div>


                            {/* CUSTOM COLOR */}

                            <div className="custom-color-row">

                                <input
                                    type="text"
                                    placeholder="Enter custom colour..."
                                    value={
                                        customColor
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setCustomColor(
                                            event.target
                                                .value
                                        )
                                    }
                                    onKeyDown={(
                                        event
                                    ) => {

                                        if (
                                            event.key ===
                                            "Enter"
                                        ) {

                                            event.preventDefault();

                                            addCustomColor();
                                        }
                                    }}
                                />


                                <button
                                    type="button"
                                    onClick={
                                        addCustomColor
                                    }
                                >
                                    + Add
                                </button>

                            </div>


                            {/* SELECTED COLORS */}

                            {Array.isArray(
                                form.colors
                            ) &&
                                form.colors.length >
                                0 && (

                                    <div className="selected-colors">

                                        {form.colors.map(
                                            (
                                                color
                                            ) => (

                                                <span
                                                    key={
                                                        color
                                                    }
                                                    className="selected-color"
                                                >

                                                    {
                                                        color
                                                    }


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setForm(
                                                                (current) => ({
                                                                    ...current,
                                                                    colors: Array.isArray(current.colors)
                                                                        ? current.colors.filter(
                                                                            (item) => item !== color
                                                                        )
                                                                        : [],
                                                                })
                                                            )
                                                        }
                                                    >
                                                        ×
                                                    </button>

                                                </span>
                                            )
                                        )}

                                    </div>
                                )}

                        </div>

                    </section>


                    {/* =================================================
                        04 STORE SETTINGS
                    ================================================= */}

                    <section className="admin-form-card">

                        <div className="admin-section-title">

                            <span>
                                04
                            </span>


                            <div>

                                <small>
                                    STORE SETTINGS
                                </small>


                                <h2>
                                    Visibility
                                </h2>

                            </div>

                        </div>


                        {/* VISIBLE */}

                        <label className="featured-toggle">

                            <input
                                type="checkbox"
                                name="isVisible"
                                checked={
                                    form.isVisible
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <span className="toggle">
                                <span />
                            </span>


                            <div>

                                <strong>
                                    Visible on Store
                                </strong>


                                <small>
                                    Customers can see
                                    and purchase this
                                    product.
                                </small>

                            </div>

                        </label>


                        {/* FEATURED */}

                        <label className="featured-toggle">

                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={
                                    form.isFeatured
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <span className="toggle">
                                <span />
                            </span>


                            <div>

                                <strong>
                                    Featured Product
                                </strong>


                                <small>
                                    Show this product
                                    in featured
                                    sections.
                                </small>

                            </div>

                        </label>

                    </section>


                    {/* =================================================
                        MESSAGES
                    ================================================= */}

                    {error && (

                        <div className="admin-form-error">
                            {error}
                        </div>

                    )}


                    {message && (

                        <div className="admin-form-success">
                            {message}
                        </div>

                    )}


                    {/* =================================================
                        SUBMIT
                    ================================================= */}

                    <button
                        type="submit"
                        className="admin-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Uploading Product..."
                            : "Add Product"}

                    </button>

                </motion.form>

            </main>
        </>
    );
}