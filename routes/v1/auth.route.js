const express = require('express');
const router = express.Router();
const { apiPayloadValidate } = require('../../middlewares/validate');
const { authValidation } = require('../../validations');
const { authController } = require('../../controller');


router.post('/login',apiPayloadValidate(authValidation.loginSchemas.login,'body'),authController.login);
router.post('/signup',apiPayloadValidate(authValidation.addUserSchema.addUser,'body'),authController.addUser);
router.get('/user/details',authController.getUser);
router.post('/forgot-password',apiPayloadValidate(authValidation.forgotPasswordSchemas.forgotPassword,'body'),authController.forgotPassword);
router.post('/confirm-forgot-password',apiPayloadValidate(authValidation.forgotPasswordSchemas.confirmForgotPassword,'body'),authController.confirmForgotPassword);

module.exports = router;