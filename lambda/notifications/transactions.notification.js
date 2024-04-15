const {
    sendMail
  } = require("../services/service.sendGrid");
  
const { EMAIL_NOTIFICATION, EMAIL_TOPUP_FAIL } = process.env;

const notify = async (event, error) => {
  try {
    const message = {
      to: EMAIL_TOPUP_FAIL,
      from: EMAIL_NOTIFICATION,
        subject: `${process.env.ENVIRONMENT}: failed to get transactions`,
        text: `The blockchain-api has attempted to all transactions for a user .\n\n` +
          `The attempt was made: ${new Date()} \n\n` +
          `If this was in staging then you can ignore this email\n\n` +
          `Only mark this email as read when you have assessed the impact \n\n` +
          `The details that was attempted were the following\n\n` +
          `Content of failed request : ${JSON.stringify(error)} \n\n` +
          `Content of event : ${JSON.stringify(event)} \n\n`,
      };
      await sendMail(message)
      console.log(`notification sent succesfully`)
      return {
        status: 'success',
        message: 'notification sent'
      };
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        message: error
      }
    }
  }
  module.exports = {
    notify
  }