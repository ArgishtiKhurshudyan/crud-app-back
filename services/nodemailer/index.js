"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
module.exports.transporter = async () => {

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    service: 'Gmail',
    ignoreTLS: true,
    socketTimeout: 5000,
    auth: {
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PASS, // generated ethereal password
    },
  });
}