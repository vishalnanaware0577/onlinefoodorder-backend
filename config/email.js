const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // 587 असल्यामुळे false

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },

    tls: {
        rejectUnauthorized: false,
    },
});

transporter.verify((err) => {
    if (err) {
        console.log("❌ Gmail SMTP Error:");
        console.log(err);
    } else {
        console.log("✅ Gmail SMTP Connected");
    }
});

module.exports = transporter;