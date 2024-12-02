const users = require("../constant/users").users;
const fs = require("fs");

const clearAllCookies = (req, res) => {
  res.clearCookie("username");
  res.clearCookie("email");
  res.clearCookie("isadmin");
  return;
};

const setAllCookies = (req, res, username, email, isAdmin) => {
  res.cookie("username", username, { maxAge: 1000 * 360 });
  res.cookie("email", email, { maxAge: 1000 * 360 });
  res.cookie("isadmin", isAdmin, { maxAge: 1000 * 360 });
  return;
};

const userLogin = (req, res) => {
  const { userEmail, userPassword } = req.body;

  for (let index of users) {
    if (userEmail === index.email && userPassword == index.password) {
      setAllCookies(req, res, index.username, index.email, index.isAdmin);
      return res.redirect("/");
    }
  }

  return res.redirect("/login");
};

const userSignUp = (req, res) => {
  clearAllCookies(req, res);
  const { userName, userEmail, userPassword } = req.body;
  users.push({
    id: new Date().getTime(),
    username: userName,
    email: userEmail,
    password: userPassword,
    isAdmin: false,
  });
  fs.writeFileSync(
    "C:/Users/Ace PC37/Desktop/Temp/Express/page/constant/users.js",
    `export const users = ${JSON.stringify(users)}`
  );

  setAllCookies(req, res, userName, userEmail, false);

  return res.redirect("/");
};

const userLogOut = (req, res) => {
  clearAllCookies(req, res);
  res.redirect("/");
};

module.exports = {
  userLogin,
  userSignUp,
  userLogOut,
};
