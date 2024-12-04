const { setCookies } = require("./utils/cookies");
const { sendMail } = require("./utils/sendMail");
const { updateUserVerified, getUsers } = require("../db.js");

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
      getUsers((err, users) => {
        if (err) {
          console.error("Error fetching users: ", err.message);
          return res.status(500).send("Internal Server Error");
        }

        let userUpdated = false;

        for (let index of users) {
          if (req.cookies.email === index.email) {
            index.verified = true;
            console.log("User verified: ", index);

            updateUserVerified((err, result) => {
              if (err) {
                console.error(
                  "Failed to update verified status: ",
                  err.message
                );
              } else {
                console.log("User's verified status updated successfully.");
              }
            }, index.userId);

            setCookies(req, res, index);

            userUpdated = true;
          }
        }

        if (userUpdated) {
          return res.redirect("/");
        } else {
          return res.status(400).send("User not found or OTP mismatch.");
        }
      });
    }
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
  }
  return res.redirect("/verify");
};

const changeEmail = (req, res) => {
  res.clearCookie("otp");
  res.clearCookie("email");
  return res.redirect("/verify");
};

module.exports = { verifyEmail, resendEmail, changeEmail };
