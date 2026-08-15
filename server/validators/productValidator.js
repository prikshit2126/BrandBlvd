const { body } = require("express-validator");

exports.productValidation = [

    body("name")
        .notEmpty()
        .withMessage("Product name required"),

    body("price")
        .isFloat({ min: 1 })
        .withMessage("Price must be greater than 0"),

    body("stock")
        .isInt({ min: 0 })
        .withMessage("Invalid stock"),

    body("category")
        .notEmpty()
        .withMessage("Category required")

];