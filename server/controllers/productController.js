const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

/* =========================================================
   HELPERS
========================================================= */

const parseJsonArray = (value) => {
    if (!value) return [];

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const parseBoolean = (value, defaultValue = false) => {
    if (value === undefined || value === null) {
        return defaultValue;
    }

    return value === true || value === "true";
};

const parseNumberOrNull = (value) => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : null;
};


/* =========================================================
   CLOUDINARY UPLOAD
========================================================= */

const uploadImages = async (files = []) => {
    const imageUrls = [];

    for (const file of files) {
        const result = await new Promise(
            (resolve, reject) => {
                const stream =
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "BrandBlvd",
                        },
                        (error, result) => {
                            if (error) {
                                return reject(error);
                            }

                            resolve(result);
                        }
                    );

                stream.end(file.buffer);
            }
        );

        imageUrls.push(result.secure_url);
    }

    return imageUrls;
};


/* =========================================================
   ADD PRODUCT
========================================================= */

const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            originalPrice,
            category,
            brand,
            stock,
            lowStockThreshold,
            sizes,
            colors,
            isVisible,
            isFeatured,
        } = req.body;


        /* -------------------------------------------------
           PRICES
        ------------------------------------------------- */

        const sellingPrice = Number(price);

        const comparePrice =
            parseNumberOrNull(originalPrice);


        if (
            !Number.isFinite(sellingPrice) ||
            sellingPrice < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid selling price",
            });
        }


        if (
            comparePrice !== null &&
            comparePrice < sellingPrice
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Compare-at price must be greater than or equal to the selling price",
            });
        }


        /* -------------------------------------------------
           PRODUCT OPTIONS
        ------------------------------------------------- */

        const parsedSizes =
            parseJsonArray(sizes);

        const parsedColors =
            parseJsonArray(colors);


        /* -------------------------------------------------
           IMAGES
        ------------------------------------------------- */

        const imageUrls =
            await uploadImages(req.files || []);


        /* -------------------------------------------------
           CREATE PRODUCT
        ------------------------------------------------- */

        const product =
            await Product.create({
                name,
                description,

                price: sellingPrice,

                originalPrice: comparePrice,

                category,

                brand:
                    brand || "BrandBlvd",

                stock:
                    Number(stock) || 0,

                lowStockThreshold:
                    Number(lowStockThreshold) || 5,

                sizes: parsedSizes,

                colors: parsedColors,

                isVisible:
                    parseBoolean(
                        isVisible,
                        true
                    ),

                isFeatured:
                    parseBoolean(
                        isFeatured,
                        false
                    ),

                images: imageUrls,
            });


        /* -------------------------------------------------
           RESPONSE
        ------------------------------------------------- */

        res.status(201).json({
            success: true,

            message:
                "Product added successfully",

            product,
        });

    } catch (error) {
        console.error(
            "ADD PRODUCT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   GET PRODUCTS
========================================================= */

const getProducts = async (req, res) => {
    try {
        const {
            keyword,
            category,
            minPrice,
            maxPrice,
            featured,
            page = 1,
            limit = 10,
        } = req.query;


        /* -------------------------------------------------
           QUERY
        ------------------------------------------------- */

        const query = {
            isVisible: true,
        };


        if (keyword) {
            query.name = {
                $regex: keyword,
                $options: "i",
            };
        }


        if (category) {
            query.category = category;
        }


        if (featured === "true") {
            query.isFeatured = true;
        }


        /* -------------------------------------------------
           PRICE FILTER
        ------------------------------------------------- */

        if (minPrice || maxPrice) {
            query.price = {};

            if (minPrice) {
                query.price.$gte =
                    Number(minPrice);
            }

            if (maxPrice) {
                query.price.$lte =
                    Number(maxPrice);
            }
        }


        /* -------------------------------------------------
           PAGINATION
        ------------------------------------------------- */

        const currentPage =
            Math.max(Number(page) || 1, 1);

        const perPage =
            Math.max(Number(limit) || 10, 1);

        const skip =
            (currentPage - 1) *
            perPage;


        /* -------------------------------------------------
           FETCH
        ------------------------------------------------- */

        const products =
            await Product.find(query)
                .skip(skip)
                .limit(perPage);


        const totalProducts =
            await Product.countDocuments(
                query
            );


        /* -------------------------------------------------
           RESPONSE
        ------------------------------------------------- */

        res.json({
            success: true,

            totalProducts,

            currentPage,

            totalPages:
                Math.ceil(
                    totalProducts /
                        perPage
                ),

            products,
        });

    } catch (error) {
        console.error(
            "GET PRODUCTS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   GET PRODUCT BY ID
========================================================= */

const getProductById = async (req, res) => {
    try {
        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found",
            });
        }


        res.json({
            success: true,
            product,
        });

    } catch (error) {
        console.error(
            "GET PRODUCT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   UPDATE PRODUCT
========================================================= */

const updateProduct = async (req, res) => {
    try {
        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found",
            });
        }


        const {
            name,
            description,
            price,
            originalPrice,
            category,
            brand,
            stock,
            lowStockThreshold,
            sizes,
            colors,
            isVisible,
            isFeatured,
            existingImages,
        } = req.body;


        /* -------------------------------------------------
           PRICES
        ------------------------------------------------- */

        const sellingPrice =
            Number(price);

        const comparePrice =
            parseNumberOrNull(
                originalPrice
            );


        if (
            !Number.isFinite(
                sellingPrice
            ) ||
            sellingPrice < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid selling price",
            });
        }


        if (
            comparePrice !== null &&
            comparePrice < sellingPrice
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Compare-at price must be greater than or equal to the selling price",
            });
        }


        /* -------------------------------------------------
           EXISTING IMAGES
        ------------------------------------------------- */

        let imageUrls = [];

        if (existingImages) {
            imageUrls =
                parseJsonArray(
                    existingImages
                );
        }


        /* -------------------------------------------------
           NEW IMAGES
        ------------------------------------------------- */

        if (
            req.files &&
            req.files.length > 0
        ) {
            const newImages =
                await uploadImages(
                    req.files
                );

            imageUrls.push(
                ...newImages
            );
        }


        /* -------------------------------------------------
           UPDATE PRODUCT
        ------------------------------------------------- */

        product.name = name;
        product.description =
            description;

        product.price =
            sellingPrice;

        product.originalPrice =
            comparePrice;

        product.category =
            category;

        product.brand =
            brand || "BrandBlvd";

        product.stock =
            Number(stock) || 0;

        product.lowStockThreshold =
            Number(
                lowStockThreshold
            ) || 5;

        product.sizes =
            parseJsonArray(sizes);

        product.colors =
            parseJsonArray(colors);

        product.isVisible =
            parseBoolean(
                isVisible,
                product.isVisible
            );

        product.isFeatured =
            parseBoolean(
                isFeatured,
                product.isFeatured
            );

        product.images =
            imageUrls;


        /* -------------------------------------------------
           SAVE
        ------------------------------------------------- */

        const updatedProduct =
            await product.save();


        /* -------------------------------------------------
           RESPONSE
        ------------------------------------------------- */

        res.json({
            success: true,

            message:
                "Product updated successfully",

            product:
                updatedProduct,
        });

    } catch (error) {
        console.error(
            "UPDATE PRODUCT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   DELETE PRODUCT
========================================================= */

const deleteProduct = async (req, res) => {
    try {
        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found",
            });
        }


        await product.deleteOne();


        res.json({
            success: true,

            message:
                "Product deleted successfully",
        });

    } catch (error) {
        console.error(
            "DELETE PRODUCT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   EXPORT
========================================================= */

module.exports = {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};