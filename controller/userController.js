const { validateUser, calculateAge } = require("./utils/userFunctions");
const { setUserCookies, clearAllCookies } = require("./utils/cookies");
const { getUsers, postUser, editUser } = require("../db.js");

// Handles user login: checks user credentials and sets cookies if successful
const userLogin = (req, res) => {
  const { user, userPassword } = req.body;
  const error = {};
  var flags = [false, false];

  // Retrieve users from the database
  getUsers((err, users) => {
    if (err) {
      // In case of a database error, render error page
      return res.render("error", {
        heading: "Database Error",
        content: "Trouble retrieving users",
        redirect: { desc: "Try again", link: "/login" },
      });
    }

    // Check if the user exists and the password matches
    for (let index of users) {
      if (user === index.email || user === index.userName) {
        flags[0] = true;
        if (userPassword === index.password) {
          flags[1] = true;
          // Set cookies and redirect to home if login is successful
          setUserCookies(req, res, index);
          return res.redirect("/");
        }
      }
    }

    // Return errors if login fails
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

// Handles user sign-up: validates user input and creates a new user and automatically logs them in
const userSignUp = (req, res) => {
  clearAllCookies(req, res);

  // Extract user details from request body
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

  // Validate user input
  if (!validateUser(user)) {
    // If validation passes, insert user into the database
    postUser((err, success) => {
      if (err) {
        // Handle errors if the user already exists (e.g., email or username conflict)
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
        // Set cookies for the new user and redirect to home page
        setUserCookies(req, res, user);
        return res.redirect("/");
      }
    }, user);
  } else {
    // If validation fails, render the signup page with errors
    return res.render("signup", { errors: validateUser(user), user: user });
  }
};

// Handles user logout: clears all cookies and redirects to the home page
const userLogOut = (req, res) => {
  clearAllCookies(req, res);
  res.redirect("/");
};

// Handles user profile editing: updates user details and sets updated cookies
const userEdit = (req, res) => {
  const { firstName, lastName, phone, dob, address } = req.body;

  // Create an updated user object with new values
  const updated = {
    ...JSON.parse(req.cookies.user),
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    dob: dob,
    address: address,
    password: "Verified@0", // Default password set after verification
    confirmPassword: "Verified@0", // Default password confirmation
  };

  // Validate updated user information
  if (!validateUser(updated)) {
    // If validation passes, update user data in the database
    editUser(
      (err, success) => {
        if (err) {
          // Handle any database errors and redirect to edit profile
          console.log(err.sqlMessage);
          res.redirect("/editProfile");
        } else {
          // Set updated cookies and redirect to the profile page
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
      JSON.parse(req.cookies.user).userId
    );
  } else {
    // If validation fails, render the edit profile page with errors
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
