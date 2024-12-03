const users = require("../constant/users").users;
const validateUser = require("../constant/validateUser").validateUser;
const calculateAge = require("../constant/calculateAge").calculateAge;
const { setCookies, clearAllCookies } = require("../constant/cookies");
const fs = require("fs");

const userLogin = (req, res) => {
  const { user, userPassword } = req.body;

  for (let index of users) {
    if (
      (user === index.email || user === index.userName) &&
      userPassword == index.password
    ) {
      setCookies(req, res, index);

      return res.redirect("/");
    }
  }

  return res.redirect("/login");
};

const userSignUp = (req, res) => {
  clearAllCookies(req, res);
  const {
    firstName,
    lastName,
    userName,
    email,
    phone,
    dob,
    address,
    password,
    confirmPassword,
  } = req.body;

  var user = {
    userName: userName,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
    phone: phone,
    dob: dob,
    address: address,
  };

  if (!validateUser(user)) {
    users.push({
      userId: new Date().getTime(),
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      phone: phone,
      dob: dob,
      age: calculateAge(dob),
      address: address,
      isAdmin: false,
      verified: false,
    });

    fs.writeFileSync(
      "C:/Users/Ace PC37/Desktop/Temp/Express/page/constant/users.js",
      `export const users=${JSON.stringify(users)}`
    );

    setCookies(req, res, users[users.length - 1]);
    return res.redirect("/");
  } else {
    return res.redirect("/signup");
  }
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
