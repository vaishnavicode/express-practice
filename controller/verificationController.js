const { setUserCookies } = require("./utils/cookies");
const { sendMail, generateRandomOtp } = require("./utils/sendMail");
const { updateUserVerified, getUsers } = require("../db.js");

const verifyEmail = (req, res) => {
  const now = Date.now();
  const lastOtpSentAt = req.cookies.lastOtpSentAt;

  // Handle OTP resend
  if (req.url == "/resend") {
    if (lastOtpSentAt && now - lastOtpSentAt < 60000) {
      const remainingTime = 60 - Math.floor((now - lastOtpSentAt) / 1000);
      return res.render("verify", {
        send: req.cookies.otp ? true : false,
        errors: {
          otp: `Please wait ${remainingTime} seconds before resending the OTP.`,
        },
      });
    }

    // Resend OTP if the cooldown has passed
    return resendOtp(req, res);
  }

  // Check for user session
  if (!req.cookies.user) {
    return res.render("error", {
      heading: "No User Found",
      content: "Please log in again, your session expired.",
      redirect: { desc: "Login", link: "/login" },
    });
  }

  // Handle OTP verification
  if (req.cookies.otp) {
    const email = JSON.parse(req.cookies.user).email;
    const { otp } = req.body;

    if (otp === req.cookies.otp) {
      return verifyOtpAndUpdateUser(email, req, res);
    } else {
      return res.render("verify", {
        send: true,
        errors: {
          otp: "Incorrect OTP.",
        },
      });
    }
  }

  // If no OTP found, generate and send new OTP
  return generateAndSendOtp(req, res);
};

// Helper function to generate and send OTP
const generateAndSendOtp = (req, res) => {
  const email = JSON.parse(req.cookies.user).email;
  const otp = generateRandomOtp(6);

  sendMail(req, res, otp, email);

  // Set OTP and last OTP sent time
  res.cookie("otp", otp, { expires: new Date(Date.now() + 180000) }); // 3 minutes expiry
  res.cookie("lastOtpSentAt", Date.now(), {
    expires: new Date(Date.now() + 180000),
  });

  return res.redirect("/verify");
};

// Helper function to resend OTP
const resendOtp = (req, res) => {
  const email = JSON.parse(req.cookies.user).email;
  const otp = generateRandomOtp(6);

  sendMail(req, res, otp, email);
  res.cookie("otp", otp, { expires: new Date(Date.now() + 180000) }); // 3 minutes expiry
  res.cookie("lastOtpSentAt", Date.now(), {
    expires: new Date(Date.now() + 180000),
  });

  return res.redirect("/verify");
};

// Helper function to verify OTP and update user status
const verifyOtpAndUpdateUser = (email, req, res) => {
  getUsers((err, users) => {
    if (err) {
      console.error("Error fetching users: ", err.message);
      return res.render("error", {
        heading: "Data Error",
        content: "Internal Server Error",
        redirect: { desc: "Go To Home", link: "/" },
      });
    }

    let userUpdated = false;

    // Check if the user exists and update verification status
    for (let user of users) {
      if (email === user.email) {
        user.verified = true;

        updateUserVerified((err) => {
          if (err) {
            console.log("Failed to update verified status: ", err.message);
          } else {
            console.log("User's verified status updated successfully.");
          }
        }, user.userId);

        setUserCookies(req, res, user);
        userUpdated = true;
        break; // Exit loop once the user is found and updated
      }
    }

    // Handle case where user is not found
    if (userUpdated) {
      return res.redirect("/");
    } else {
      return res.render("error", {
        heading: "Data Error",
        content: "User not found or OTP mismatch.",
        redirect: { desc: "Go To Home", link: "/" },
      });
    }
  });
};

module.exports = { verifyEmail };
