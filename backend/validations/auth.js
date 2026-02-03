const joi = require('joi')

const registerSchema = joi.object({
    name: joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.emtpy': 'Name is required',
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name cannot exceed 50 characters',
            'any.required': 'Name is required'
    }),

    email: joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Invalid email format',
            'any.required': 'Email is required'
    }),

    password: joi.string()
        .min(6)
        .max(128)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
            'string.max': 'Password cannot exceed 128 characters'
    }),

    role: joi.string()
        .valid('user', 'moderator')
        .optional()
        .messages({
            '.any.only': 'Role must bem either user or moderator'
        })
})

const loginSchema = joi.string()
    .min(1)
    .required()
    .messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    })


module.exports = {
    registerSchema,
    loginSchema
};