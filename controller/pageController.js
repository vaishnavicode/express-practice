const { getUsers } = require("../db.js");
const { verifyEmail } = require("./verificationController.js");

const homePage = (req, res) => {
  if (req.cookies.user) {
    const user = JSON.parse(req.cookies.user);
    if (user.verified) {
      return res.redirect("/users");
    } else {
      return res.redirect("/verify");
    }
  } else {
    return res.redirect("/login");
  }
};

const userPage = (req, res) => {
  if (!req.cookies.user) {
    res.render("error", {
      heading: "No User Found",
      content: "Please log in.",
      redirect: { desc: "Login", link: "/login" },
    });
  }
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
    if (!req.cookies.otp) {
      return verifyEmail(req, res);
    } else {
      return res.render("verify", {
        send: req.cookies.otp ? true : false,
        errors: {},
      });
    }
  } else {
    return res.render("error", {
      heading: "Not Logged In",
      content: "Cannot verify!",
      redirect: { desc: "Login", link: "/login" },
    });
  }
};

const profilePage = (req, res) => {
  if (!req.cookies.user) {
    res.render("error", {
      heading: "No User Found",
      content: "Please log in.",
      redirect: { desc: "Login", link: "/login" },
    });
  }
  return res.render("profile", { user: JSON.parse(req.cookies.user) });
};
const editProfilePage = (req, res) => {
  if (!req.cookies.user) {
    res.render("error", {
      heading: "No User Found",
      content: "Please log in.",
      redirect: { desc: "Login", link: "/login" },
    });
  }
  return res.render("editProfile", {
    user: JSON.parse(req.cookies.user),
    errors: {},
  });
};
const uploadProfileImagePage = (req, res) => {
  if (!req.cookies.user) {
    res.render("error", {
      heading: "No User Found",
      content: "Please log in.",
      redirect: { desc: "Login", link: "/login" },
    });
  }
  return res.render("uploadpicture", {});
};

module.exports = {
  homePage,
  userLoginPage,
  userSignUpPage,
  verificationPage,
  userPage,
  profilePage,
  editProfilePage,
  uploadProfileImagePage,
};
