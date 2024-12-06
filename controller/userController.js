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
        content: "Trouble retrieving users",
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

  if (
    !validateUser({
      ...user,
      profileImageUrl: "https://randomuser.me/api/portraits/lego/1.jpg",
    })
  ) {
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
        res.clearCookie("uploadedImageUrl", { path: "/" });
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
  const { firstName, lastName, phone, dob, address, profileImageUrl } =
    req.body;

  const userCookie = req.cookies.user && JSON.parse(req.cookies.user);

  if (!userCookie) {
    return res.render("error", {
      heading: "No User Found",
      content: "Please log in to edit your profile.",
      redirect: { desc: "Login", link: "/login" },
    });
  }

  const updated = {
    ...userCookie,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    dob: dob,
    address: address,
    password: "Verified@0",
    confirmPassword: "Verified@0",
    profileImageUrl: profileImageUrl,
  };

  console.log("req.cookies.uploadedImageUrl", req.cookies.uploadedImageUrl);

  if (req.cookies.uploadedImageUrl) {
    updated.profileImageUrl = req.cookies.uploadedImageUrl;
  }

  if (!validateUser(updated)) {
    editUser(
      (err, success) => {
        if (err) {
          console.log(err.sqlMessage);
          res.redirect("/editProfile");
        } else {
          setUserCookies(req, res, updated);
          console.log("User changed");
          res.redirect("/profile");
        }
      },
      firstName,
      lastName,
      phone,
      dob,
      address,
      profileImageUrl,
      userCookie.userId
    );
  } else {
    return res.render("editProfile", {
      user: userCookie,
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
