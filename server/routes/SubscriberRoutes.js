const express = require("express");
const Subscriber = require("../models/Subscriber");

const router = express.Router();

/*
    POST /api/subscribers
    Subscribe to newsletter
*/
router.post("/", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase();

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email.",
            });
        }

        const existingSubscriber =
            await Subscriber.findOne({
                email: normalizedEmail,
            });

        if (existingSubscriber) {
            return res.status(409).json({
                success: false,
                message: "This email is already subscribed.",
            });
        }

        const subscriber =
            await Subscriber.create({
                email: normalizedEmail,
            });

        res.status(201).json({
            success: true,
            message: "Successfully subscribed!",
            subscriber: {
                id: subscriber._id,
                email: subscriber.email,
            },
        });
    } catch (error) {
        console.error(
            "Newsletter subscription error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again.",
        });
    }
});

module.exports = router;