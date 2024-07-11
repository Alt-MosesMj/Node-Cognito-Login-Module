const User = require('../db/models/User.model');
const UserManagement = require('../db/models/usermanagement.model');

async function insertUser(user) {
    try {
        user.updated_at = new Date();
        user.role = "user";
        const response = await User.create(user);
        return response.toJSON();
      } catch (error) {
        throw new Error('Unable to insert data: ' + error.message);
      }
}

async function addUserInUserManagement(user) {
  try {
      const userManagement = {};
      userManagement.email = user.email;
      userManagement.date_of_signup =  new Date();
      const response = await UserManagement.create(userManagement);
      return response.toJSON();
    } catch (error) {
      throw new Error('Unable to insert data in user management: ' + error.message);
    }
}


async function getUserByEmail(email) {
  try {
      const response = await User.findOne({where : {email}});
      return response ? response.toJSON() : null;
    } catch (error) {
      throw new Error('Unable to insert data: ' + error.message);
    }
}


module.exports = {
  insertUser,
  getUserByEmail,
  addUserInUserManagement
};