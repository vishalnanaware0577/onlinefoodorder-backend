const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

transporter.verify((err, success) => {
    if (err) {
        console.log("❌ Gmail SMTP Error:");
        console.log(err);
    } else {
        console.log("✅ Gmail Connected Successfully");
    }
});

module.exports = transporter;