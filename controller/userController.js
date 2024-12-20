const { validateUser, calculateAge } = require("./utils/userFunctions");
const { setUserCookies, clearAllCookies } = require("./utils/cookies");
const { getUsers, postUser, editUser, deleteUser } = require("../db.js");

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
    isAdmin: false,
    verified: false,
  };

  if (
    !validateUser({
      ...user,
      profileImageUrl:
        "https://res.cloudinary.com/daxhdgmdb/image/upload/v1733722641/user-circle-svgrepo-com_vbvlkr.png",
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
    firstName,
    lastName,
    phone,
    dob,
    address,
    password: "Verified@0",
    confirmPassword: "Verified@0",
  };

  if (req.cookies.uploadedImageUrl) {
    updated.profileImageUrl = req.cookies.uploadedImageUrl;
  } else if (req.cookies.changedImageUrl) {
    updated.profileImageUrl = req.cookies.changedImageUrl;
  }

  const originalname = req.cookies.originalname;

  const validationErrors = validateUser(updated);
  if (validationErrors) {
    return res.render("editProfile", {
      user: userCookie,
      errors: validationErrors,
    });
  }

  editUser(
    (err, success) => {
      if (err) {
        console.error("Error updating user profile:", err.message);
        return res.redirect("/editProfile");
      }

      setUserCookies(req, res, updated);
      res.clearCookie("uploadedImageUrl");
      res.clearCookie("originalname");
      res.clearCookie("changedImageUrl");
      return res.redirect("/profile");
    },
    updated.firstName,
    updated.lastName,
    updated.phone,
    updated.dob,
    updated.address,
    userCookie.userId,
    updated.profileImageUrl,
    userCookie.profileImageUrl !== updated.profileImageUrl,
    originalname || ""
  );
};

const deleteUserPermanently = (req, res) => {
  if (req.cookies.user) {
    const userId = JSON.parse(req.cookies.user).userId;
    deleteUser((err, result) => {
      if (err) {
        console.error("Error deleting user: ", err.sqlMessage);
        return res
          .status(500)
          .send("An error occurred while deleting the user.");
      }

      console.log("User deleted successfully");
      clearAllCookies(req, res);
      return res.redirect("/");
    }, userId);
  } else {
    return res.redirect("/");
  }
};

module.exports = {
  userLogin,
  userSignUp,
  userLogOut,
  userEdit,
  deleteUserPermanently,
};
