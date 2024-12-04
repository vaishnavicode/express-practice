const { getUsers } = require("../db.js");

const homePage = (req, res) => {
  getUsers((err, users) => {
    if (err) {
      return res.render("error", {
        heading: "Database Error",
        content: "Trouble retriving users",
        redirect: { desc: "Try again", link: "/login" },
      });
    }

    if (req.cookies.user) {
      const user = JSON.parse(req.cookies.user);
      return res.render("home", {
        userName: user.userName,
        verified: user.verified,
        loggedIn: true,
      });
    } else {
      return res.render("home", {
        userName: "User",
        verified: false,
        loggedIn: false,
      });
    }
  });
};

const userPage = (req, res) => {
  getUsers((err, users) => {
    if (err) {
      return res.render("error", {
        heading: "Database Error",
        content: "Trouble retriving users",
        redirect: { desc: "Try again", link: "/login" },
      });
    }

    if (req.cookies.user) {
      const user = JSON.parse(req.cookies.user);
      if (user.verified) {
        return res.render("users", {
          usersList: users,
          userName: user.userName,
          verified: user.verified,
        });
      }
      return res.render("error", {
        heading: "Cannot View User",
        content: "Not verified",
        redirect: { desc: "Verify Yourself", link: "/verify" },
      });
    } else {
      return res.render("error", {
        heading: "Cannot View User",
        content: "Not logged in",
        redirect: { desc: "Log In", link: "/login" },
      });
    }
  });
};

const userLoginPage = (req, res) => {
  if (req.cookies.user) {
    return res.render("error", {
      heading: "Already logged in",
      content: "You are already logged in",
      redirect: { desc: "Logout", link: "/logout" },
    });
  } else {
    return res.render("login", {
      errors: {},
      user: { user: "", password: "" },
    });
  }
};

const userSignUpPage = (req, res) => {
  if (req.cookies.user) {
    return res.render("error", {
      heading: "Already logged in",
      content: "You are already logged in",
      redirect: { desc: "Logout", link: "/logout" },
    });
  } else {
    return res.render("signup", { errors: {}, user: {} });
  }
};

const verificationPage = (req, res) => {
  if (req.cookies.user) {
    if (JSON.parse(req.cookies.user).verified) {
      return res.render("error", {
        heading: "Already Verified",
        content: "Cannot verify again!",
        redirect: { desc: "Go to Home", link: "/" },
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
      redirect: { desc: "Login", link: "/login" },
    });
  }
};

const profilePage = (req, res) => {
  return res.render("profile", { user: JSON.parse(req.cookies.user) });
};
const editProfilePage = (req, res) => {
  return res.render("editProfile", {
    user: JSON.parse(req.cookies.user),
    errors: {},
  });
};

module.exports = {
  homePage,
  userLoginPage,
  userSignUpPage,
  verificationPage,
  userPage,
  profilePage,
  editProfilePage,
};
