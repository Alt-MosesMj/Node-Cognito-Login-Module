const httpStatus = require('http-status');
const Joi = require('joi');
const logger = require('./logger');



const apiPayloadValidate = (schema, property) => (req, res, next) => {
    // Call the trimmerFunction with the request body as the argument
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (!error) {
        next();
    } else {
        const { details } = error;
        const message = details.map((i) => i.message).join(",");
        logger.warn(message);
        res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
            error: message
        })
    }
};

module.exports = {
    apiPayloadValidate
}