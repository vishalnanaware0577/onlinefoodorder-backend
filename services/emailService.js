const transporter = require("../config/email");

const sendWelcomeEmail = async (user) => {

    let subject = "";
    let html = "";

    switch (user.role) {

        case "customer":

            subject = "🍔 Welcome to Online Food Ordering";

            html = `
                <h2>Hello ${user.name} 👋</h2>

                <p>Welcome to Online Food Ordering System.</p>

                <h3>You can now</h3>

                <ul>
                    <li>🍕 Browse Restaurants</li>
                    <li>❤️ Add Wishlist</li>
                    <li>🛒 Add to Cart</li>
                    <li>💳 Online Payment</li>
                    <li>📦 Track Orders</li>
                    <li>⭐ Give Reviews</li>
                </ul>

                <p>Enjoy delicious food!</p>
            `;
            break;

        case "hotel_owner":

            subject = "🏨 Welcome Hotel Owner";

            html = `
                <h2>Hello ${user.name}</h2>

                <p>Your Restaurant Partner account has been created successfully.</p>

                <ul>
                    <li>🏨 Add Restaurant</li>
                    <li>🍔 Add Foods</li>
                    <li>📷 Upload Images</li>
                    <li>📦 Manage Orders</li>
                    <li>💰 View Earnings</li>
                </ul>

                <p>Thank you for joining us.</p>
            `;
            break;

        default:

            subject = "🚚 Welcome Delivery Partner";

            html = `
                <h2>Hello ${user.name}</h2>

                <p>Your Delivery Partner account has been created.</p>

                <ul>
                    <li>📦 Accept Orders</li>
                    <li>📍 Track Location</li>
                    <li>✅ Update Delivery Status</li>
                    <li>💰 Earn Money</li>
                </ul>

                <p>Happy Deliveries 🚀</p>
            `;
    }

    try {

        await transporter.sendMail({
            from: `"Online Food Ordering" <${process.env.EMAIL_FROM}>`,
            to: user.email,
            subject,
            html,
        });

        console.log("✅ Welcome Email Sent");

    } catch (err) {

        console.log("❌ Email Error");
        console.log(err);

    }
};

module.exports = {
    sendWelcomeEmail,
};