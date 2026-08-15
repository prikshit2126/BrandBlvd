const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const validate = require("../middleware/validationMiddleware");

const {
    registerValidation
} = require("../validators/authValidator");

// Register
router.post(
    "/register",
    registerValidation,
    validate,
    registerUser
);

// Login
router.post("/login", loginUser);

module.exports = router;