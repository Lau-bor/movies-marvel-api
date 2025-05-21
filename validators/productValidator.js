const {body} = require('express-validator');

const nameValidator = body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({min: 2, max: 100}).withMessage('Name must be between 2 and 100 characters long.')

const priceValidator = body('price')
    .notEmpty().withMessage('Price is required')
    .isInt({min: 0}).withMessage('Price must be a positive integer')

const descriptionValidator = body('description')
    .notEmpty().withMessage('Description is required')
    .trim()
    .isLength({min: 2, max: 100}).withMessage('Description must be between 2 and 100 characters long.')

exports.ValidateCreateProduct = [
    nameValidator,
    priceValidator,
    descriptionValidator
]

exports.ValidateUpdateProduct = [
    nameValidator.optional(),
    priceValidator.optional(),
    descriptionValidator.optional()
]

