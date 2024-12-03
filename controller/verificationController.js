const users = require("../constant/users").users;
const connection = require("../database/connection");
const fs = require("fs");
const { setCookies } = require("../constant/cookies");
const { sendMail } = require("../constant/sendMail");
const generateRandomOtp = (len) => {
  var otp = "";
  for (let i = 0; i < len; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};

const verifyEmail = (req, res) => {
  if (req.cookies.otp) {
    const { otp } = req.body;
    if (req.cookies.otp && otp === req.cookies.otp) {
      for (let index of users) {
        if (req.cookies.email === index.email) {
          index.verified = true;
          console.log("Enter", index);
          var temp = JSON.stringify(index);
          setCookies(req, res, index);
          fs.writeFileSync(
            "C:/Users/Ace PC37/Desktop/Temp/Express/page/constant/users.js",
            `export const users=${JSON.stringify(users)}`
          );
        }
      }
    }
    return res.redirect("/");
  } else {
    const { email } = req.body;
    var otp = generateRandomOtp(6);
    sendMail(req, res, otp, email);
    res.cookie("otp", otp, { expire: 120000 + Date.now() });
    res.cookie("email", email, { expire: 120000 + Date.now() });
    return res.redirect("/verify");
  }
};

const resendEmail = (req, res) => {
  if (req.cookies.otp) {
    var otp = generateRandomOtp(6);
    res.cookie("otp", otp);
    sendMail(req, res, otp, req.cookies.email);
    return res.redirect("/verify");
  } else {
    return res.render("error", {
      heading: "Cannot resend",
      content: "Cannot resend!",
      back: "/",
    });
  }
};

const changeEmail = (req, res) => {
  res.clearCookie("otp");
  res.clearCookie("email");
  return res.redirect("/verify");
};

module.exports = { verifyEmail, resendEmail, changeEmail };
