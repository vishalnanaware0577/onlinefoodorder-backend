const nodemailer = require("nodemailer");
require("dotenv").config();

console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("EMAIL_FROM:", process.env.EMAIL_FROM);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

transporter.verify((error) => {
    if (error) {
        console.log("❌ Gmail SMTP Error:");
        console.log(error);
    } else {
        console.log("✅ Gmail SMTP Connected Successfully");
    }
});

module.exports = transporter;