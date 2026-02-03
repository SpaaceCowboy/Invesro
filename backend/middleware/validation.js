const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // collect all errors
            striptUnknown: true // delete unknown fields
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message
            }))

            return res.status(401).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        req.body = value;
        next()
    }
}

module.exports = validate;