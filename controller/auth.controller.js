const httpStatus = require('http-status');
const logger = require('../middlewares/logger');
const catchAsync = require('../middlewares/catchAsync');
const userService = require('../services/user.service');

const login = catchAsync(async (req, res) => {
    try {
        const response = await userService.login(req.body.email , req.body.password);
        res.status(httpStatus.OK).json(response);
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json(error.message);
        logger.error("Error occured in login" , error);
    }
});

const addUser = catchAsync(async (req, res) => {
    try {
        const response = await userService.addUser(req.body);
        res.status(httpStatus.OK).json(response);
    } catch (error) {
        logger.error("Error occured in addUser Service" + error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
});

const getUser = catchAsync(async (req, res) => {
    try {
        const response = await userService.getUser(req['current-user']);
        res.status(httpStatus.OK).json(response);
    } catch (error) {
        logger.error("Error occured in get User method" + error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
});

const forgotPassword = catchAsync(async (req, res) => {
    try {
        const { username } = req.body;
        const response = await userService.forgotPassword(username);
        res.status(httpStatus.OK).json(response);
    } catch (error) {
        logger.error("Error occured in forgotpassword method" + error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
});

const confirmForgotPassword = catchAsync(async (req, res) => {
    const { username , verificationCode, newPassword} = req.body;
    try {
        const response = await userService.confirmForgotPassword(username, verificationCode, newPassword);
        res.status(httpStatus.OK).json(response);
    } catch (error) {
        logger.error("Error occured in confirmforgotpassword method" + error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
});

module.exports = {
    login,
    addUser,
    getUser,
    forgotPassword,
    confirmForgotPassword
};