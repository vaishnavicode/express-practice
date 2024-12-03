const users = require("../constant/users").users;
const connection = require("../database/connection");

const homePage = (req, res) => {
  if (req.cookies.user) {
    var user = JSON.parse(req.cookies.user);
    return res.render("users", {
      usersList: users,
      userName: user.userName,
      verified: user.verified,
    });
  } else {
    return res.redirect("/login");
  }
};

const userPage = (req, res) => {
  if (req.cookies.user) {
    return res.render("users", { usersList: users });
  } else {
    return res.send("No authorisation!");
  }
};

const userLoginPage = (req, res) => {
  if (req.cookies.userName) {
    return res.render("error", {
      heading: "Already logged in",
      content: "You are already logged in",
      back: "/",
    });
  } else {
    return res.render("login");
  }
};

const userSignUpPage = (req, res) => {
  if (req.cookies.userName) {
    return res.render("error", {
      heading: "Already logged in",
      content: "You are already logged in",
      back: "/",
    });
  } else {
    return res.render("signup");
  }
};

const verificationPage = (req, res) => {
  if (req.cookies.user) {
    if (JSON.parse(req.cookies.user).verified) {
      return res.render("error", {
        heading: "Already Verified",
        content: "Cannot verify again!",
        back: "/",
      });
    }
    return res.render("verify", {
      send: req.cookies.otp ? true : false,
      buttonText: req.cookies.send ? "Verify" : "Send OTP",
      defaultEmail: req.cookies.user ? JSON.parse(req.cookies.user).email : "",
    });
  } else {
    return res.render("error", {
      heading: "Not Logged In",
      content: "Cannot verify!",
      back: "/",
    });
  }
};

module.exports = {
  homePage,
  userPage,
  userLoginPage,
  userSignUpPage,
  verificationPage,
};
