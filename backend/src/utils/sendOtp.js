const nodemailer = require("nodemailer");

const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "AgroVista <no-reply@agrovista.com>",
    to: email,
    subject: "Your AgroVista OTP",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  });
};

module.exports = sendOtp;
