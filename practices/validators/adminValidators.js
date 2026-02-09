const { body, param, validationResult } = require("express-validator");

/**
 * Validation middleware helper
 * Checks for validation errors and returns formatted error response
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Validation rules for MongoDB ObjectId
 */
const validateUserId = [
    param('id').isMongoId().withMessage('Invalid user ID')
];

/**
 * Validation rules for creating admin user
 */
const validateCreateAdmin = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Name must be 3-30 characters'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email format'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('cast')
        .trim()
        .notEmpty()
        .withMessage('Cast is required'),

    body('birthDate')
        .isISO8601()
        .withMessage('Invalid date format')
];

/**
 * Validation rules for updating user (PUT request)
 * All fields are optional
 */
const validateUpdateUser = [
    param('id')
        .isMongoId()
        .withMessage('Invalid user ID'),

    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Name must be 3-30 characters'),

    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email format'),

    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be user or admin'),

    body('cast')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Cast cannot be empty'),

    body('birthDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format')
];

/**
 * Validation rules for updating user (POST form submission)
 * All fields are required
 */
const validateUpdateUserForm = [
    param('id')
        .isMongoId()
        .withMessage('Invalid user ID'),

    body('name')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Name must be 3-30 characters'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email format'),

    body('role')
        .isIn(['user', 'admin'])
        .withMessage('Role must be user or admin'),

    body('cast')
        .trim()
        .notEmpty()
        .withMessage('Cast is required'),

    body('birthDate')
        .isISO8601()
        .withMessage('Invalid date format')
];

module.exports = {
    validate,
    validateUserId,
    validateCreateAdmin,
    validateUpdateUser,
    validateUpdateUserForm
};
