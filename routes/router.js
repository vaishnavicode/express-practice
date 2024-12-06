const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// Import controllers
const {
  homePage,
  userSignUpPage,
  userLoginPage,
  verificationPage,
  userPage,
  profilePage,
  editProfilePage,
  uploadProfileImagePage,
} = require("../controller/pageController");

const {
  userLogin,
  userSignUp,
  userLogOut,
  userEdit,
} = require("../controller/userController");

const { uploadProfileImage } = require("../controller/profileImageController");
const { verifyEmail } = require("../controller/verificationController");
const {
  validateProfileImageUrl,
} = require("../controller/utils/userFunctions");

const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const validationResult = validateProfileImageUrl(file.originalname);
    console.log(validationResult);
    if (validationResult) {
      return cb(new Error(validationResult.profileImageUrl), false);
    }
    cb(
      null,
      JSON.parse(req.cookies.user).userName + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage }).single("profileImageFile");

router.get("/", homePage);
router.get("/login", userLoginPage);
router.post("/login", userLogin);
router.get("/signup", userSignUpPage);
router.post("/signup", userSignUp);
router.get("/logout", userLogOut);
router.get("/verify", verificationPage);
router.post("/verify", verifyEmail);
router.get("/resend", verifyEmail);
router.get("/users", userPage);
router.get("/profile", profilePage);
router.get("/editProfile", editProfilePage);
router.post("/editProfile", userEdit);
router.get("/uploadProfileImage", uploadProfileImagePage);
router.post(
  "/uploadProfileImage",
  (req, res, next) => {
    console.log("Upload started");

    upload(req, res, (err) => {
      console.log(1);
      if (err) {
        console.log("Error during file upload");
        res.redirect("/uploadProfileImage?error=true");
      } else {
        console.log(2);
        next();
      }
    });
  },
  uploadProfileImage
);

module.exports = router;
