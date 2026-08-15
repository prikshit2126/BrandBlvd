const Category = require("../models/Category");

// Add Category
const addCategory = async (req, res) => {

    try {

        const { name, image } = req.body;

        const exists = await Category.findOne({ name });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name,
            image
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Get Categories
const getCategories = async (req, res) => {

    try {

        const categories = await Category.find();

        res.json({
            success: true,
            categories
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Update Category
const updateCategory = async (req, res) => {

    try {

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        res.json({
            success: true,
            category
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Delete Category
const deleteCategory = async (req, res) => {

    try {

        await Category.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Category deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory
};