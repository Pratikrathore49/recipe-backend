const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "krishnaptl43@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

module.exports = transporter;