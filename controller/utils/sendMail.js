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
const sendMail = (req, res, otp, email) => {
  const receiver = {
    from: "dummytest0094@gmail.com",
    to: `${email}`,
    subject: "OTP for Verification",
    text: `Your otp : ${otp}. It will be valid for two minutes.`,
  };
  auth.sendMail(receiver, (error, emailResponse) => {
    if (error) throw error;
    console.log("Mail Sent!");
    response.end();
  });
  return true;
};

module.exports = { sendMail };
