require("dotenv").config();
const app_constants = require("../json/constants.json")
const logger = require("../services/logger");
const AWS = require('aws-sdk');
const client = new AWS.SecretsManager({
  region: 'ap-south-1',
});
const ses = new AWS.SES({
  region: 'ap-south-1' // Replace with your desired region
});

const pinpoint = new AWS.Pinpoint({
  region: 'ap-south-1' // Replace with your desired region
});

async function getSecrets(key) {
  const secret = await client.getSecretValue({
    SecretId: app_constants[process.env.ENVIRONMENT]['AWS_SECRET_NAME']
  }).promise();
  let values = JSON.parse(secret.SecretString);
  return values[key];
}
async function sendEmail(subject, body, recipient) {
  const params = {
    Source: 'admin@qikcollect.ai', // Replace with your SES verified email address
    Destination: {
      ToAddresses: [recipient]
    },
    Message: {
      Subject: {
        Data: subject
      },
      Body: {
        Html: {
          Data: body
        }
      }
    }
  };

  try {
    await ses.sendEmail(params).promise();
    logger.info('Email sent successfully');
  } catch (error) {
    logger.error('Failed to send email:', error);
  }
}

async function sendOTPMessageRequest(destinationPhoneNumber, OTP) {
  const params = {
    ApplicationId: 'dcb1d9c70cd546a0a2ee01347886515f',
    MessageRequest: {
      Addresses: {
        [destinationPhoneNumber]: {
          ChannelType: 'SMS'
        }
      },
      MessageConfiguration: {
        SMSMessage: {
          Body: `Your OTP for phone verification for tradersark is ${OTP}`,
          MessageType: 'TRANSACTIONAL'
        }
      }
    }
  };

  try {
    const data = await pinpoint.sendMessages(params).promise();
    logger.debug('OTP message request sent successfully: ', data);
  } catch (err) {
    logger.debug('Error sending OTP message request: ', err);
  }
}

module.exports = {
  getSecrets,
  sendEmail,
  sendOTPMessageRequest
}
