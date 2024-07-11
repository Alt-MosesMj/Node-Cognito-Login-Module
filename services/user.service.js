
const cognitoService = require('../services/cognito.service');
const userRepository = require('../repository/user.repository');

async function addUser(user) {
  const existingUser = await userRepository.getUserByEmail(user?.email);
  if(existingUser != null){
    throw new Error('User Already Existing');
  }
  //Setting user role
  user.role = "user";
  const userCognitoResponse = await cognitoService.addUserInCognito(user);
  const userResponse = await userRepository.insertUser(user);
  console.log("User Response", userResponse);
  const userManagementResponse = await userRepository.addUserInUserManagement(user);
  console.log("User Management Response", userManagementResponse);
  return "User registered succesfully";
}

const login = async(username , password) => {
  return await cognitoService.authenticateUser(username , password);
};

async function getUser(user) {
  const email = user?.email;
  const userResponse = await userRepository.getUserByEmail(email);
  console.log("User Response", userResponse);
  return userResponse;
}

const forgotPassword = async(username) => {
  return await cognitoService.forgotPassword(username);
};

const confirmForgotPassword = async(username, verificationCode, newPassword) => {
  return await cognitoService.confirmForgotPassword(username, verificationCode, newPassword);
};


module.exports = {
  addUser,
  login,
  getUser,
  forgotPassword,
  confirmForgotPassword
};