const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const passwordMail = async (to, token) => {
  const mailOptions = {
    from: {
      name: "Auth",
      address: "auth@gmail.com",
    },
    to,
    subject: "Change Password link",
    html: `<p>Please click the following link to verify your account: <a href="http://localhost:5000/api/v1/auth/change-password/${token}">Verify</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Error sending email");
  }
};

module.exports = passwordMail;
