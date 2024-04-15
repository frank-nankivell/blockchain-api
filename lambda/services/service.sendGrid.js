
const sgMail = require("@sendgrid/mail");
const {SENDGRID_API_KEY} = process.env
const sendMail = async (message) => {
    try {
      sgMail.setApiKey(SENDGRID_API_KEY);
      const response = await sgMail.send(message);
      return response;
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error)
        throw console.error(error.response.body);
      }
    }
  }

module.exports = {sendMail}