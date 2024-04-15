const {
  sendMail
} = require("../services/service.sendGrid");
const { EMAIL_NOTIFICATION } = process.env;
const notify = async (_user_id, error) => {
  try {
    const message = {
      to: process.env.EMAIL_TOPUP_FAIL,
      from: EMAIL_NOTIFICATION,
      subject: `${process.env.ENVIRONMENT}: failed to create new account on Telos`,
      text: `The blockchain-api has attempted to create a new blockchain account for user_id ('s) ${JSON.stringify(_user_id)}) .\n\n` +
        `The attempt was made: ${new Date()} \n\n` +
        `If this was in staging then you can ignore this email\n\n` +
        `Only mark this email as read when you have assessed the impact \n\n` +
        `The details that was attempted were the following\n\n` +
        `Content of failed request : ${JSON.stringify(error)} \n\n`,
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
      message: error.message
    }
  }
}
module.exports = {
  notify
}