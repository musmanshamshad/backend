const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY, EMAIL_FROM } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

//send email
function sendEmail(recipient, subject, html) {
  return new Promise(function (resolve, reject) {
    const mail = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.mailerHost, // Your email id
        pass: process.env.mailerPassword, // Your password,
      },
    });

    const mailOptions = {
      from: process.env.mailerHost,
      to: recipient,
      subject,
      html,
    };

    mail.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(1);
        reject(error);
      } else {
        resolve(info);
        console.log(0);
      }
    });
  });
}

const send = async (recipient, subject, html) => {
  try {
    const msg = {
      to: recipient,
      from: EMAIL_FROM,
      subject: subject,
      // text: "",
      html: html,
    };
    const response = await sgMail.send(msg);
    console.log(response[0].statusCode);
    console.log(response[0].headers);
  } catch (error) {
    console.log(`sending mail error ${error}`);
  }
};

module.exports = {
  sendEmail,
  send,
};
