const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
    getAllTodos,
    createTodo,
    updateTodo,
    deleteTodo,
} = require("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation errors",
            errors: errors.array().map((err) => ({
                field: err.param,
                message: err.msg,
            })),
        });
    }
    next();
};

router.get("/", authMiddleware, getAllTodos);

router.post(
    "/",
    [
        authMiddleware,
        body("name")
            .notEmpty()
            .withMessage("Name is required")
            .isLength({ max: 50 })
            .withMessage("Name cannot exceed 50 characters"),
        body("description")
            .notEmpty()
            .withMessage("Description is required")
            .isString()
            .withMessage("Description must be a string")
            .isLength({ max: 200 })
            .withMessage("Description cannot exceed 200 characters"),
        body("completed")
            .notEmpty()
            .withMessage("Completed is required")
            .isBoolean()
            .withMessage("Completed must be a boolean"),
        handleValidationErrors,
    ],
    createTodo
);

router.put(
    "/:id",
    [
        authMiddleware,
        param("id").isMongoId().withMessage("Invalid todo ID"),
        body("name")
            .optional()
            .notEmpty()
            .withMessage("Name cannot be empty")
            .isLength({ max: 50 })
            .withMessage("Name cannot exceed 50 characters"),
        body("description")
            .notEmpty()
            .withMessage("Description is required")
            .isString()
            .withMessage("Description must be a string")
            .isLength({ max: 200 })
            .withMessage("Description cannot exceed 200 characters"),
        body("completed")
            .notEmpty()
            .withMessage("Completed is required")
            .isBoolean()
            .withMessage("Completed must be a boolean"),
        handleValidationErrors,
    ],
    updateTodo
);

router.delete(
    "/:id",
    [
        authMiddleware,
        param("id").isMongoId().withMessage("Invalid todo ID"),
        handleValidationErrors,
    ],
    deleteTodo
);

module.exports = router;
