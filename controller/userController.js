const { validateUser, calculateAge } = require("./utils/userFunctions");
const { setUserCookies, clearAllCookies } = require("./utils/cookies");
const { getUsers, postUser, editUser } = require("../db.js");

const userLogin = (req, res) => {
  const { user, userPassword } = req.body;
  const error = {};
  var flags = [false, false];
  getUsers((err, users) => {
    if (err) {
      return res.render("error", {
        heading: "Database Error",
        content: "Trouble retriving users",
        redirect: { desc: "Try again", link: "/login" },
      });
    }

    for (let index of users) {
      if (user === index.email || user === index.userName) {
        flags[0] = true;
        if (userPassword === index.password) {
          flags[1] = true;
          setUserCookies(req, res, index);
          return res.redirect("/");
        }
      }
    }

    if (!flags[0]) {
      error["users"] = "Username or email is not correct.";
    }
    if (!flags[1]) {
      error["password"] = "Password is incorrect.";
    }
    return res.render("login", {
      errors: error,
      user: { user: user, password: userPassword },
    });
  });
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
    age: calculateAge(dob),
    isAdmin: false,
    verified: false,
  };

  if (!validateUser(user)) {
    postUser((err, success) => {
      if (err) {
        return res.render("signup", {
          errors: {
            email: err.sqlMessage.includes("email")
              ? "Email already registered."
              : null,
            userName: err.sqlMessage.includes("userName")
              ? "Username already exists."
              : null,
          },
          user: user,
        });
      } else {
        setUserCookies(req, res, user);
        return res.redirect("/");
      }
    }, user);
  } else {
    return res.render("signup", { errors: validateUser(user), user: user });
  }
};

const userLogOut = (req, res) => {
  clearAllCookies(req, res);
  res.redirect("/");
};

const userEdit = (req, res) => {
  const { firstName, lastName, phone, dob, address } = req.body;

  console.log(firstName, lastName, phone, dob, address);
  const updated = {
    ...JSON.parse(req.cookies.user),
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    dob: dob,
    address: address,
    password: "Verified@0",
    confirmPassword: "Verified@0",
  };

  if (!validateUser(updated)) {
    editUser(
      (err, success) => {
        if (err) {
          console.log(err.sqlMessage);
          res.redirect("/editProfile");
        } else {
          setUserCookies(req, res, updated);
          console.log("UserChanged");
          res.redirect("/profile");
        }
      },
      firstName,
      lastName,
      phone,
      dob,
      address,
      JSON.parse(req.cookies.user).userId
    );
  } else {
    return res.render("editProfile", {
      user: JSON.parse(req.cookies.user),
      errors: validateUser(updated),
    });
  }
};

module.exports = {
  userLogin,
  userSignUp,
  userLogOut,
  userEdit,
};
