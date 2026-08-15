const Review = require("../models/Review");
const Product = require("../models/Product");

// Add Review
const addReview = async (req, res) => {

    try {

        const { productId, rating, comment } = req.body;

        const alreadyReviewed = await Review.findOne({
            user: req.user.id,
            product: productId
        });

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        const review = await Review.create({
            user: req.user.id,
            product: productId,
            rating,
            comment
        });

        const reviews = await Review.find({
            product: productId
        });

        const avg =
            reviews.reduce((acc, item) => acc + item.rating, 0) /
            reviews.length;

        await Product.findByIdAndUpdate(productId, {
            rating: avg,
            numReviews: reviews.length
        });

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Get Product Reviews
const getProductReviews = async (req, res) => {

    try {

        const reviews = await Review.find({
            product: req.params.productId
        }).populate("user", "name");

        res.json({
            success: true,
            reviews
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Update Review
const updateReview = async (req, res) => {

    try {

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        review.rating = req.body.rating;
        review.comment = req.body.comment;

        await review.save();

        const reviews = await Review.find({
            product: review.product
        });

        const avg =
            reviews.reduce((acc, item) => acc + item.rating, 0) /
            reviews.length;

        await Product.findByIdAndUpdate(review.product, {
            rating: avg,
            numReviews: reviews.length
        });

        res.json({
            success: true,
            message: "Review updated",
            review
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Delete Review
const deleteReview = async (req, res) => {

    try {

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        await review.deleteOne();

        const reviews = await Review.find({
            product: review.product
        });

        let avg = 0;

        if (reviews.length > 0) {
            avg =
                reviews.reduce((acc, item) => acc + item.rating, 0) /
                reviews.length;
        }

        await Product.findByIdAndUpdate(review.product, {
            rating: avg,
            numReviews: reviews.length
        });

        res.json({
            success: true,
            message: "Review deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview
};