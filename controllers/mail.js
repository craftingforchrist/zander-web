const nodemailer = require('nodemailer');
const inlinecss = require('nodemailer-juice');

var transporter = nodemailer.createTransport({
  host: process.env.servicehost,
  port: process.env.serviceport,
  secure: false,
  auth: {
    user: process.env.serviceauthuser,
    pass: process.env.serviceauthpass,
  },
  tls: {
    rejectUnauthorized: false
  }
});
transporter.use('compile', inlinecss());

module.exports = transporter;
