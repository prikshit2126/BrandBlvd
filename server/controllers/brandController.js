const Brand = require("../models/Brand");

// Add Brand
const addBrand = async (req, res) => {

    try {

        const { name, logo } = req.body;

        const exists = await Brand.findOne({ name });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Brand already exists"
            });
        }

        const brand = await Brand.create({
            name,
            logo
        });

        res.status(201).json({
            success: true,
            message: "Brand created successfully",
            brand
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Get Brands
const getBrands = async (req, res) => {

    try {

        const brands = await Brand.find();

        res.json({
            success: true,
            brands
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Update Brand
const updateBrand = async (req, res) => {

    try {

        const brand = await Brand.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        res.json({
            success: true,
            message: "Brand updated successfully",
            brand
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Delete Brand
const deleteBrand = async (req, res) => {

    try {

        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        await brand.deleteOne();

        res.json({
            success: true,
            message: "Brand deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    addBrand,
    getBrands,
    updateBrand,
    deleteBrand
};