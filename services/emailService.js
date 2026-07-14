const transporter = require('../config/email');

const sendWelcomeEmail = async (user) => {

  const currentDate = new Date();

  const date = currentDate.toLocaleDateString('en-IN');

  const time = currentDate.toLocaleTimeString('en-IN');

  let subject = "";
  let html = "";

  switch (user.role) {

    case "customer":

      subject = "🍕 Welcome to Online Food Ordering System";

      html = `
            <div style="font-family:Arial;padding:25px;background:#f4f4f4;">

            <div style="max-width:700px;margin:auto;background:#fff;border-radius:10px;padding:30px">

            <h2 style="color:#ff5722;">Welcome ${user.name} 👋</h2>

            <p>Thank you for registering on <b>Online Food Ordering System</b>.</p>

            <h3>Your Registration Details</h3>

            <table>
            <tr><td><b>Name</b></td><td>${user.name}</td></tr>
            <tr><td><b>Email</b></td><td>${user.email}</td></tr>
            <tr><td><b>Role</b></td><td>Customer</td></tr>
            <tr><td><b>Date</b></td><td>${date}</td></tr>
            <tr><td><b>Time</b></td><td>${time}</td></tr>
            </table>

            <hr>

            <h3>What can you do?</h3>

            <ul>
            <li>Browse Restaurants</li>
            <li>View Food Menu</li>
            <li>Add Food to Cart</li>
            <li>Add Food to Wishlist</li>
            <li>Apply Coupons</li>
            <li>Place Orders</li>
            <li>Track Live Orders</li>
            <li>View Order History</li>
            <li>Update Your Profile</li>
            </ul>

            <h3>Website Features</h3>

            <ul>
            <li>Multiple Restaurants</li>
            <li>Fast Delivery</li>
            <li>Secure Login using JWT</li>
            <li>Easy Checkout</li>
            <li>Online Payment Support</li>
            <li>Profile Management</li>
            </ul>

            <p>We hope you enjoy ordering delicious food with us.</p>

            <h3 style="color:#ff5722;">Happy Ordering 🍔</h3>

            </div>

            </div>
            `;

      break;

    case "restaurant_owner":

      subject = "🏨 Welcome Restaurant Owner";

      html = `
            <div style="font-family:Arial;padding:25px;background:#f5f5f5">

            <div style="max-width:700px;background:white;padding:30px;border-radius:10px;margin:auto">

            <h2>Welcome ${user.name}</h2>

            <p>Your Restaurant Owner account has been created successfully.</p>

            <h3>Account Details</h3>

            <table>

            <tr><td><b>Name</b></td><td>${user.name}</td></tr>

            <tr><td><b>Email</b></td><td>${user.email}</td></tr>

            <tr><td><b>Role</b></td><td>Restaurant Owner</td></tr>

            <tr><td><b>Date</b></td><td>${date}</td></tr>

            </table>

            <hr>

            <h3>You can now</h3>

            <ul>

            <li>Create Restaurant</li>

            <li>Upload Restaurant Image</li>

            <li>Add Food Items</li>

            <li>Manage Menu</li>

            <li>Toggle Food Availability</li>

            <li>Receive Customer Orders</li>

            <li>Update Order Status</li>

            <li>View Dashboard Analytics</li>

            </ul>

            <p>Grow your business with our platform.</p>

            </div>

            </div>
            `;

      break;

    case "delivery_partner":

      subject = "🚚 Welcome Delivery Partner";

      html = `
            <div style="font-family:Arial;padding:25px;background:#f8f8f8">

            <div style="max-width:700px;background:white;padding:30px;border-radius:10px;margin:auto">

            <h2>Welcome ${user.name}</h2>

            <p>Your Delivery Partner account is ready.</p>

            <h3>Registration Details</h3>

            <table>

            <tr><td><b>Name</b></td><td>${user.name}</td></tr>

            <tr><td><b>Email</b></td><td>${user.email}</td></tr>

            <tr><td><b>Date</b></td><td>${date}</td></tr>

            </table>

            <hr>

            <h3>You can now</h3>

            <ul>

            <li>Accept Delivery Orders</li>

            <li>View Assigned Orders</li>

            <li>Update Delivery Status</li>

            <li>Track Delivery Progress</li>

            <li>Manage Delivery Dashboard</li>

            </ul>

            <h3>Facilities</h3>

            <ul>

            <li>Real-Time Order Updates</li>

            <li>Secure Login</li>

            <li>Order History</li>

            </ul>

            <p>Thank you for joining our delivery network.</p>

            </div>

            </div>
            `;

      break;

  }

  await transporter.sendMail({
    from: `"Online Food Ordering" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: subject,
    html: html
  });

}

module.exports = {
  sendWelcomeEmail
}