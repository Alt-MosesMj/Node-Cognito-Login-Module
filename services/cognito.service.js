const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const cognito = new AWS.CognitoIdentityServiceProvider();
const userPoolId = '';// Change to your user pool ID
const clientID = '';// Change to your client ID
const clientSecret = '';// Change to your client Secret
const client = jwksClient({
  jwksUri: '' // Change to your user pool region and ID
});

const addUserInCognito = async (user) => {
  const createUserParams = {
    UserPoolId: userPoolId,
    Username: user?.email,
    UserAttributes: [
      {
        Name: 'email',
        Value: user?.email
      },
      {
        Name: 'email_verified',
        Value: 'true'
      },
      {
        Name: 'custom:realmId',
        Value: user?.realmId ?? 'euwiu489849894'
      },
    ],
    TemporaryPassword: 'zA9$T8b@7uP!'
  };


  try {
    // Create the user
    const createUserResponse = await cognito.adminCreateUser(createUserParams).promise();
    console.log('User created successfully:', createUserResponse);
  } catch (createUserError) {
    console.error('Error creating user:', createUserError);
    throw new Error(createUserError); // Exit if user creation fails
  }

  // Parameters to add the user to a group
  const addUserToGroupParams = {
    GroupName: user.role,
    UserPoolId: userPoolId,
    Username: user.email
  };

  try {
    // Add the user to the group
    const addUserToGroupResponse = await cognito.adminAddUserToGroup(addUserToGroupParams).promise();
    console.log('User added to group successfully:', addUserToGroupResponse);
  } catch (addUserToGroupError) {
    console.error('Error adding user to group:', addUserToGroupError);
    throw new Error(addUserToGroupError);
    // Optionally, you could implement further logic here to handle the error, such as removing the created user
  }
  try {
    // Set the user's password to the specified password and mark the user as confirmed
    const userPasswordResponse = await cognito.adminSetUserPassword({
      UserPoolId: userPoolId,
      Username: user.email,
      Password: user.password,
      Permanent: true
    }).promise();
    console.log("userPasswordResponse : ", userPasswordResponse);
  } catch (error) {
    console.error('Error adding confirming user to user-pool:', error);
    throw new Error(error);
    // Optionally, you could implement further logic here to handle the error, such as removing the created user
  }
};

const generateSecretHash = (username) => {
  return crypto.createHmac('SHA256', clientSecret)
    .update(`${username}${clientID}`)
    .digest('base64');
};

const authenticateUser = async (username, password) => {
  try {
    const secretHash = generateSecretHash(username);
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash
      },
    };
    const response = await cognito.initiateAuth(params).promise();
    return response.AuthenticationResult;
  } catch (error) {
    throw new Error(error?.message);
  }
}


// Function to get the signing key
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

// Middleware to verify and decode token and fetch user info
const fetchUserInfo = async (token) => {
  try {
    // Use the access token to get user information
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, async (err, decodedToken) => {
      if (err) {
        console.error('Unauthorized user :', err);
      }
      // Use the access token to get user information
      const params = {
        AccessToken: token
      };

      try {
        const user = await cognito.getUser(params).promise();
        return user?.UserAttributes;
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
  }
};

const forgotPassword = async(username) => {
  const secretHash = generateSecretHash(username);
  const params = {
    ClientId: clientID,
    Username: username,
    SecretHash: secretHash,
  };
  try {
    const data = await cognito.forgotPassword(params).promise();
    console.log('Forgot password initiated successfully:', data);
    return data;
  } catch (err) {
    console.error('Error initiating forgot password:', err);
    throw err;
  }
};

async function confirmForgotPassword(username, verificationCode, newPassword) {
  const secretHash = generateSecretHash(username);
  const params = {
    ClientId: clientID,
    Username: username,
    ConfirmationCode: verificationCode,
    Password: newPassword,
    SecretHash: secretHash,
  };

  try {
    const data = await cognito.confirmForgotPassword(params).promise();
    console.log('Password reset successfully:', data);
    return data;
  } catch (err) {
    console.error('Error resetting password:', err);
    throw err;
  }
}



module.exports = {
  addUserInCognito,
  authenticateUser,
  forgotPassword,
  confirmForgotPassword
};