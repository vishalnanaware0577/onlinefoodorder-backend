const axios = require("axios");

const sendWelcomeEmail = async (user) => {

    let subject = "";
    let html = "";

    if (user.role === "customer") {

        subject = "🍔 Welcome to Online Food Ordering";

        html = `
        <h2>Hello ${user.name}</h2>

        <p>Welcome to our Online Food Ordering Platform.</p>

        <h3>You can now</h3>

        <ul>
            <li>Browse Restaurants</li>
            <li>Search Foods</li>
            <li>Add to Cart</li>
            <li>Wishlist</li>
            <li>Track Orders</li>
            <li>Secure Online Payments</li>
        </ul>

        <p>Enjoy Delicious Food 😊</p>
        `;
    }

    else if (user.role === "hotel_owner") {

        subject = "🏨 Welcome Hotel Owner";

        html = `
        <h2>Hello ${user.name}</h2>

        <p>Welcome to our Restaurant Partner Portal.</p>

        <h3>You can now</h3>

        <ul>

            <li>Add Restaurant</li>

            <li>Add Food Items</li>

            <li>Upload Images</li>

            <li>Manage Orders</li>

            <li>Accept Orders</li>

            <li>View Revenue</li>

        </ul>

        <p>Thank You for joining us.</p>
        `;
    }

    else {

        subject = "🚚 Welcome Delivery Partner";

        html = `
        <h2>Hello ${user.name}</h2>

        <p>Welcome Delivery Partner.</p>

        <ul>

            <li>Accept Delivery Requests</li>

            <li>Track Delivery</li>

            <li>Update Order Status</li>

            <li>Complete Deliveries</li>

        </ul>

        <p>Happy Deliveries 🚴</p>
        `;
    }

    await axios.post(

        "https://api.brevo.com/v3/smtp/email",

        {

            sender: {
                email: process.env.EMAIL_FROM,
                name: "Online Food Ordering"
            },

            to: [
                {
                    email: user.email,
                    name: user.name
                }
            ],

            subject,

            htmlContent: html

        },

        {

            headers: {

                "api-key": process.env.BREVO_API_KEY,

                "Content-Type": "application/json"

            }

        }

    );

    console.log("✅ Welcome Email Sent");

};

module.exports = {
    sendWelcomeEmail
};