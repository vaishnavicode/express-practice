const users = require("../constant/users").users;
const connection = require("../database/connection");

const homePage = (req, res) => {
  return res.render("home", {
    username: req.cookies.username ? req.cookies.username : "User",
  });
};

const userPage = (req, res) => {
  var isAdmin = req.cookies.isadmin === "true";
  if (isAdmin) {
    return res.render("users", { usersList: users });
  } else {
    return res.send("No authorisation!");
  }
};

const userLoginPage = (req, res) => {
  return res.render("login");
};

const userSignUpPage = (req, res) => {
  return res.render("signup");
};

module.exports = { homePage, userPage, userLoginPage, userSignUpPage };
