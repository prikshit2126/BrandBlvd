import { useEffect, useState } from "react";

import {
    ArrowLeft,
    ImagePlus,
    X,
} from "lucide-react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import api from "../../services/api";

import "./EditProduct.css";


/* =========================================================
   CONSTANTS
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


const SIZES = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "3XL",
];


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
   HELPERS
========================================================= */

const calculateDiscount = (
    price,
    comparePrice
) => {
    const sellingPrice = Number(price);
    const originalPrice = Number(comparePrice);

    if (
        !sellingPrice ||
        !originalPrice ||
        originalPrice <= sellingPrice
    ) {
        return 0;
    }

    return Math.round(
        ((originalPrice - sellingPrice) /
            originalPrice) *
            100
    );
};


/* =========================================================
   COMPONENT
========================================================= */

export default function EditProduct() {
    const { id } = useParams();

    const navigate = useNavigate();


    /* =====================================================
       FORM
    ===================================================== */

    const [form, setForm] = useState({
        name: "",
        description: "",

        /* Pricing */
        price: "",
        originalPrice: "",

        category: "",

        brand: "BrandBlvd",

        stock: "",

        lowStockThreshold: "5",

        sizes: [],

        colors: [],

        isVisible: true,

        isFeatured: false,
    });


    /* =====================================================
       IMAGES
    ===================================================== */

    const [existingImages, setExistingImages] =
        useState([]);

    const [newImages, setNewImages] =
        useState([]);


    /* =====================================================
       COLORS
    ===================================================== */

    const [customColor, setCustomColor] =
        useState("");


    /* =====================================================
       STATES
    ===================================================== */

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");


    /* =====================================================
       LOAD PRODUCT
    ===================================================== */

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/products/${id}`
                    );

                const product =
                    response.data?.product;

                if (!product) {
                    throw new Error(
                        "Product not found."
                    );
                }


                setForm({
                    name: product.name || "",

                    description:
                        product.description || "",

                    price:
                        product.price ?? "",

                    /*
                       Support originalPrice.

                       The fallback values also make this
                       compatible if you previously used
                       compareAtPrice or mrp.
                    */

                    originalPrice:
                        product.originalPrice ??
                        product.compareAtPrice ??
                        product.mrp ??
                        "",

                    category:
                        product.category || "",

                    brand:
                        product.brand ||
                        "BrandBlvd",

                    stock:
                        product.stock ?? "",

                    lowStockThreshold:
                        product.lowStockThreshold ??
                        5,

                    sizes:
                        product.sizes || [],

                    colors:
                        product.colors || [],

                    isVisible:
                        product.isVisible !== false,

                    isFeatured:
                        Boolean(
                            product.isFeatured
                        ),
                });


                setExistingImages(
                    product.images || []
                );

            } catch (err) {
                console.error(
                    "Load product error:",
                    err
                );

                setError(
                    err.response?.data
                        ?.message ||
                    err.message ||
                    "Unable to load product."
                );

            } finally {
                setLoading(false);
            }
        };


        loadProduct();

    }, [id]);


    /* =====================================================
       FORM CHANGE
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
       NEW IMAGES
    ===================================================== */

    const handleNewImages = (
        event
    ) => {
        const selected =
            Array.from(
                event.target.files || []
            );


        if (
            existingImages.length +
            newImages.length +
            selected.length >
            5
        ) {
            setError(
                "A product can have a maximum of 5 images."
            );

            return;
        }


        setNewImages(
            (current) => [
                ...current,
                ...selected,
            ]
        );


        setError("");
    };


    /* =====================================================
       REMOVE EXISTING IMAGE
    ===================================================== */

    const removeExistingImage = (
        index
    ) => {
        setExistingImages(
            (current) =>
                current.filter(
                    (_, i) =>
                        i !== index
                )
        );
    };


    /* =====================================================
       REMOVE NEW IMAGE
    ===================================================== */

    const removeNewImage = (
        index
    ) => {
        setNewImages(
            (current) =>
                current.filter(
                    (_, i) =>
                        i !== index
                )
        );
    };


    /* =====================================================
       SIZE
    ===================================================== */

    const toggleSize = (
        size
    ) => {
        setForm((current) => ({
            ...current,

            sizes:
                current.sizes.includes(
                    size
                )
                    ? current.sizes.filter(
                        (item) =>
                            item !== size
                    )
                    : [
                        ...current.sizes,
                        size,
                    ],
        }));
    };


    /* =====================================================
       COLOR
    ===================================================== */

    const toggleColor = (
        color
    ) => {
        setForm((current) => ({
            ...current,

            colors:
                current.colors.includes(
                    color
                )
                    ? current.colors.filter(
                        (item) =>
                            item !== color
                    )
                    : [
                        ...current.colors,
                        color,
                    ],
        }));
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


        const exists =
            form.colors.some(
                (item) =>
                    item.toLowerCase() ===
                    color.toLowerCase()
            );


        if (exists) {
            setCustomColor("");
            return;
        }


        setForm((current) => ({
            ...current,

            colors: [
                ...current.colors,
                color,
            ],
        }));


        setCustomColor("");
    };


    /* =====================================================
       DISCOUNT PREVIEW
    ===================================================== */

    const discount =
        calculateDiscount(
            form.price,
            form.originalPrice
        );


    const isOnSale =
        discount > 0;


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();


        setError("");
        setMessage("");


        /* ---------------------------------------------
           PRICE VALIDATION
        --------------------------------------------- */

        const sellingPrice =
            Number(form.price);


        const originalPrice =
            Number(
                form.originalPrice
            );


        if (
            !sellingPrice ||
            sellingPrice < 0
        ) {
            setError(
                "Please enter a valid selling price."
            );

            setSaving(false);

            return;
        }


        /*
           If compare price is entered,
           it must be greater than selling price.
        */

        if (
            form.originalPrice !== "" &&
            (
                !originalPrice ||
                originalPrice <=
                    sellingPrice
            )
        ) {
            setError(
                "Compare-at price must be greater than the selling price."
            );

            return;
        }


        setSaving(true);


        try {
            const formData =
                new FormData();


            /* -----------------------------------------
               BASIC INFORMATION
            ----------------------------------------- */

            formData.append(
                "name",
                form.name.trim()
            );


            formData.append(
                "description",
                form.description.trim()
            );


            /* -----------------------------------------
               PRICING
            ----------------------------------------- */

            formData.append(
                "price",
                form.price
            );


            /*
               Send empty string when there is
               no compare-at price.

               Backend should store this as null,
               undefined or 0 depending on schema.
            */

            formData.append(
                "originalPrice",
                form.originalPrice
            );


            /* -----------------------------------------
               CATEGORY
            ----------------------------------------- */

            formData.append(
                "category",
                form.category
            );


            /* -----------------------------------------
               BRAND
            ----------------------------------------- */

            formData.append(
                "brand",
                form.brand.trim() ||
                "BrandBlvd"
            );


            /* -----------------------------------------
               STOCK
            ----------------------------------------- */

            formData.append(
                "stock",
                form.stock
            );


            formData.append(
                "lowStockThreshold",
                form.lowStockThreshold
            );


            /* -----------------------------------------
               SIZES
            ----------------------------------------- */

            formData.append(
                "sizes",
                JSON.stringify(
                    form.sizes
                )
            );


            /* -----------------------------------------
               COLORS
            ----------------------------------------- */

            formData.append(
                "colors",
                JSON.stringify(
                    form.colors
                )
            );


            /* -----------------------------------------
               STORE SETTINGS
            ----------------------------------------- */

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


            /* -----------------------------------------
               EXISTING IMAGES
            ----------------------------------------- */

            formData.append(
                "existingImages",
                JSON.stringify(
                    existingImages
                )
            );


            /* -----------------------------------------
               NEW IMAGES
            ----------------------------------------- */

            newImages.forEach(
                (image) => {
                    formData.append(
                        "images",
                        image
                    );
                }
            );


            /* -----------------------------------------
               API
            ----------------------------------------- */

            const response =
                await api.put(
                    `/products/${id}`,
                    formData
                );


            if (
                !response.data?.success
            ) {
                throw new Error(
                    response.data?.message ||
                    "Product update failed."
                );
            }


            setMessage(
                "Product updated successfully."
            );


            setTimeout(() => {
                navigate(
                    "/admin/products"
                );
            }, 800);

        } catch (err) {
            console.error(
                "Update product error:",
                err
            );


            setError(
                err.response?.data
                    ?.message ||
                err.message ||
                "Unable to update product."
            );

        } finally {
            setSaving(false);
        }
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <main className="edit-product-page">

                <div className="edit-product-loading">
                    Loading product...
                </div>

            </main>
        );
    }


    /* =====================================================
       UI
    ===================================================== */

    return (
        <main className="edit-product-page">


            {/* =================================================
                TOPBAR
            ================================================= */}

            <header className="edit-product-topbar">

                <Link
                    to="/admin"
                    className="edit-product-logo"
                >
                    BrandBlvd
                </Link>


                <Link
                    to="/admin/products"
                    className="edit-product-back-top"
                >
                    Products
                </Link>

            </header>


            {/* =================================================
                CONTAINER
            ================================================= */}

            <div className="edit-product-container">


                {/* =================================================
                    HEADING
                ================================================= */}

                <div className="edit-product-heading">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                        className="edit-product-back"
                    >
                        <ArrowLeft
                            size={15}
                        />

                        Back to Products
                    </button>


                    <span>
                        INVENTORY MANAGEMENT
                    </span>


                    <h1>
                        Edit Product
                    </h1>


                    <p>
                        Update your product
                        information.
                    </p>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <motion.form
                    className="edit-product-form"
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
                        01 PRODUCT INFORMATION
                    ================================================= */}

                    <section className="edit-card">

                        <div className="edit-card-heading">

                            <span>
                                01
                            </span>


                            <div>

                                <small>
                                    PRODUCT INFORMATION
                                </small>

                                <h2>
                                    Details
                                </h2>

                            </div>

                        </div>


                        <div className="edit-fields">


                            {/* PRODUCT NAME */}

                            <div className="edit-field full">

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
                                    required
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="edit-field full">

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
                                    rows="5"
                                    required
                                />

                            </div>


                            {/* =================================================
                                SELLING PRICE
                            ================================================= */}

                            <div className="edit-field">

                                <label>
                                    Selling Price
                                </label>

                                <div className="price-input-wrapper">

                                    <span>
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        name="price"
                                        value={
                                            form.price
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="1"
                                        placeholder="3999"
                                        required
                                    />

                                </div>

                                <small className="field-help">
                                    Price customers
                                    will pay.
                                </small>

                            </div>


                            {/* =================================================
                                COMPARE PRICE
                            ================================================= */}

                            <div className="edit-field">

                                <label>
                                    Compare-at Price
                                </label>

                                <div className="price-input-wrapper">

                                    <span>
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={
                                            form.originalPrice
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="1"
                                        placeholder="5999"
                                    />

                                </div>

                                <small className="field-help">
                                    Original price
                                    shown crossed out.
                                </small>

                            </div>


                            {/* =================================================
                                SALE PREVIEW
                            ================================================= */}

                            {isOnSale && (

                                <div className="edit-sale-preview full">

                                    <div className="edit-sale-preview-badge">
                                        ON SALE
                                    </div>


                                    <div className="edit-sale-preview-content">

                                        <span>
                                            SALE PREVIEW
                                        </span>

                                        <strong>
                                            ₹
                                            {Number(
                                                form.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                        <del>
                                            ₹
                                            {Number(
                                                form.originalPrice
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </del>

                                        <b>
                                            {discount}%
                                            OFF
                                        </b>

                                    </div>

                                </div>

                            )}


                            {/* CATEGORY */}

                            <div className="edit-field">

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
                                                {category}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* BRAND */}

                            <div className="edit-field">

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
                                />

                            </div>


                            {/* STOCK */}

                            <div className="edit-field">

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
                                    min="0"
                                    required
                                />

                            </div>


                            {/* LOW STOCK */}

                            <div className="edit-field">

                                <label>
                                    Low Stock Threshold
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

                    <section className="edit-card">

                        <div className="edit-card-heading">

                            <span>
                                02
                            </span>

                            <div>

                                <small>
                                    PRODUCT IMAGES
                                </small>

                                <h2>
                                    Images
                                </h2>

                            </div>

                        </div>


                        <div className="edit-image-grid">

                            {existingImages.map(
                                (
                                    image,
                                    index
                                ) => (

                                    <div
                                        className="edit-image"
                                        key={`existing-${index}`}
                                    >

                                        <img
                                            src={image}
                                            alt={`Product ${
                                                index + 1
                                            }`}
                                        />


                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeExistingImage(
                                                    index
                                                )
                                            }
                                            aria-label="Remove image"
                                        >
                                            <X
                                                size={15}
                                            />
                                        </button>

                                    </div>

                                )
                            )}


                            {newImages.map(
                                (
                                    image,
                                    index
                                ) => (

                                    <div
                                        className="edit-image"
                                        key={`new-${image.name}-${index}`}
                                    >

                                        <img
                                            src={URL.createObjectURL(
                                                image
                                            )}
                                            alt="New product"
                                        />


                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeNewImage(
                                                    index
                                                )
                                            }
                                            aria-label="Remove image"
                                        >
                                            <X
                                                size={15}
                                            />
                                        </button>

                                    </div>

                                )
                            )}

                        </div>


                        {existingImages.length +
                            newImages.length <
                            5 && (

                            <label className="edit-image-upload">

                                <ImagePlus
                                    size={24}
                                />

                                <strong>
                                    Add Image
                                </strong>

                                <small>
                                    Up to 5 total
                                    images
                                </small>

                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={
                                        handleNewImages
                                    }
                                />

                            </label>

                        )}

                    </section>


                    {/* =================================================
                        03 OPTIONS
                    ================================================= */}

                    <section className="edit-card">

                        <div className="edit-card-heading">

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
                                                form.sizes.includes(
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


                        {/* COLORS */}

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
                                                form.colors.includes(
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
                                            event.target.value
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

                            {form.colors.length >
                                0 && (

                                <div className="selected-colors">

                                    {form.colors.map(
                                        (
                                            color
                                        ) => (

                                            <span
                                                key={color}
                                                className="selected-color"
                                            >

                                                {color}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setForm(
                                                            (
                                                                current
                                                            ) => ({
                                                                ...current,

                                                                colors:
                                                                    current.colors.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item !==
                                                                            color
                                                                    ),
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

                    <section className="edit-card">

                        <div className="edit-card-heading">

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

                        <label className="edit-featured">

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


                            <span>
                                Visible on Store
                            </span>


                            <small>
                                Customers can see
                                and purchase this
                                product.
                            </small>

                        </label>


                        {/* FEATURED */}

                        <label className="edit-featured">

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


                            <span>
                                Featured Product
                            </span>


                            <small>
                                Show this product
                                in featured
                                sections.
                            </small>

                        </label>

                    </section>


                    {/* =================================================
                        MESSAGES
                    ================================================= */}

                    {error && (

                        <div className="edit-error">
                            {error}
                        </div>

                    )}


                    {message && (

                        <div className="edit-success">
                            {message}
                        </div>

                    )}


                    {/* =================================================
                        SAVE
                    ================================================= */}

                    <button
                        type="submit"
                        className="edit-submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving Changes..."
                            : "Save Changes"}
                    </button>

                </motion.form>

            </div>

        </main>
    );
}