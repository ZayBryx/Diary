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

const emailVerification = async (to, token) => {
  const mailOptions = {
    from: {
      name: "Auth",
      address: "auth@gmail.com",
    },
    to,
    subject: "Verify Your Account",
    html: `<p>Please click the following link to verify your account: <a href="http://localhost:5000/api/v1/auth/verification/${token}">Verify</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Error sending email");
  }
};

module.exports = emailVerification;
