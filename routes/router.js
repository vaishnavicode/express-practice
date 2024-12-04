const {
  homePage,
  userSignUpPage,
  userLoginPage,
  verificationPage,
  userPage,
} = require("../controller/pageController");

const {
  userLogin,
  userSignUp,
  userLogOut,
} = require("../controller/userController");

const {
  verifyEmail,
  resendEmail,
  changeEmail,
} = require("../controller/verificationController");
const express = require("express");
const router = express.Router();

router.get("/", homePage);
router.get("/login", userLoginPage);
router.post("/login", userLogin);
router.get("/signup", userSignUpPage);
router.post("/signup", userSignUp);
router.get("/logout", userLogOut);
router.get("/verify", verificationPage);
router.post("/verify", verifyEmail);
router.get("/resend", resendEmail);
router.get("/change-mail", changeEmail);
router.get("/users", userPage);

module.exports = router;
