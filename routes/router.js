const {
  homePage,
  userPage,
  userSignUpPage,
  userLoginPage,
} = require("../controller/pageController");
const {
  userLogin,
  userSignUp,
  userLogOut,
} = require("../controller/userController");

const express = require("express");
const router = express.Router();

// Define the route for home
router.get("/", homePage);
router.get("/login", userLoginPage);
router.post("/login", userLogin);
router.get("/signup", userSignUpPage);
router.post("/signup", userSignUp);
router.get("/users", userPage);
router.get("/logout", userLogOut);

// Export the router
module.exports = router;
