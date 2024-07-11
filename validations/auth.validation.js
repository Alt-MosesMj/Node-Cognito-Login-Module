const Joi = require('joi');
const PasswordComplexity = require("joi-password-complexity");

const loginSchemas = {
  login: Joi.object().keys({
    email: Joi.string().required().email(),
    password: validatePassword(),
  }),
  forgotPassword: Joi.object().keys({
    username: Joi.string().required().email(),
  }),
};

const forgotPasswordSchemas = {
  forgotPassword: Joi.object().keys({
    username: Joi.string().required().email(),
  }),
  confirmForgotPassword:  Joi.object().keys({
    username: Joi.string().required().email(),
    verificationCode: Joi.string().required(),
    newPassword: validatePassword(),
  }),
};

function validatePassword () {
  const complexityOptions = {
    min: 8,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
  };
  return PasswordComplexity(complexityOptions);
}

const addUserSchema = {
  addUser: Joi.object().keys({
    name: Joi.string().required(),
    user_name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,30}$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must be 8-30 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.'
    }),
  }),
}
//New version of joi validate json definition
// const userSchema = Joi.object({
//   username: Joi.string().alphanum().min(3).max(30).required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
//   repeat_password: Joi.ref('password'),
// }).with('password', 'repeat_password');

module.exports = {
  loginSchemas,
  addUserSchema,
  forgotPasswordSchemas
};