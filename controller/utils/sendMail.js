const { response } = require("express");
const nodemailer = require("nodemailer");
const auth = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "dummytest0094@gmail.com",
    pass: "rkcxfxvrroftwcqv",
  },
});
const sendMail = (req, res, otp, email, resend) => {
  const receiver = {
    from: "dummytest0094@gmail.com",
    to: `${email}`,
    subject: `${resend ? "Resend: " : ""} OTP for Verification`,
    text: `Your otp : ${otp}. It will be expire in three minutes.`,
  };
  auth.sendMail(receiver, (error, emailResponse) => {
    if (error) throw error;
    console.log("Mail Sent!");
    response.end();
  });
  return true;
};

const generateRandomOtp = (len) => {
  var otp = "";
  for (let i = 0; i < len; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};

module.exports = { sendMail, generateRandomOtp };
