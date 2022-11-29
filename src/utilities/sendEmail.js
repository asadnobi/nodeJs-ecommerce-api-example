const nodemailer = require('nodemailer');

const sendEmail = async (recipient, subject, emailBody) => {
  try {
    const smtpTransport = await nodemailer.createTransport({
      host: process.env.MAILERHOST,
      port: process.env.MAILERPORT,
      auth: {
        user: process.env.MAILERUN,
        pass: process.env.MAILERPW
      }
    });
    const mailOptions = {
      to: recipient,
      subject: subject,
      text: emailBody
    }
    const data = await smtpTransport.sendMail(mailOptions);
    return data;
  } catch (err) {
    return err;
  }
}

module.exports = sendEmail;