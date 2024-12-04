const { validateUser } = require("./utils/validateUser");
const { calculateAge } = require("./utils/calculateAge");
const { setCookies, clearAllCookies } = require("./utils/cookies");
const { getUsers } = require("../models/getUsers");
const { postUser } = require("../models/postUser");

const userLogin = (req, res) => {
  const { user, userPassword } = req.body;

  getUsers((err, users) => {
    if (err) {
      return res.status(500).send("Error retrieving users");
    }

    for (let index of users) {
      if (
        (user === index.email || user === index.userName) &&
        userPassword === index.password
      ) {
        setCookies(req, res, index);
        return res.redirect("/");
      }
    }

    return res.redirect("/login");
  });
};

const userSignUp = (req, res) => {
  clearAllCookies(req, res);

  // Destructure user details from the request body
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

  // Create user object
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
    age: calculateAge(dob),
    isAdmin: false,
    verified: false,
  };

  if (!validateUser(user)) {
    postUser((err, success) => {
      if (err) {
        return res.status(500).send("Error registering user.");
      }

      setCookies(req, res, user);
      return res.redirect("/");
    }, user);
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
