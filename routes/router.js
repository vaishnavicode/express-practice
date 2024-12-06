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
const {
  renameOtherPictures,
} = require("../controller/utils/profilePictureFunctions");

const uploadPath =
  "C:/Users/Ace PC37/Desktop/Temp/Express/Express Practice/uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const preprocessUploads = (req, res, next) => {
  try {
    const user = JSON.parse(req.cookies.user);
    if (!user || !user.userName) {
      throw new Error("Invalid user information in cookies.");
    }

    const username = user.userName;

    // Call renameOtherPictures before any upload starts
    renameOtherPictures(username);
    console.log(`Preprocessing complete for user: ${username}`);
    next();
  } catch (error) {
    console.error("Error in preprocessing uploads:", error.message);
    res.status(400).send({ error: error.message });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      cb(null, uploadPath);
    } catch (error) {
      cb(error, false);
    }
  },
  filename: (req, file, cb) => {
    try {
      const validationResult = validateProfileImageUrl(file.originalname);
      if (validationResult) {
        return cb(new Error(validationResult.profileImageUrl), false);
      }

      const user = JSON.parse(req.cookies.user);
      const username = user.userName;
      const extension = ".png"; // Hardcoded to .png, change if needed
      const filename = `${username}_1${extension}`;
      cb(null, filename);
    } catch (error) {
      cb(error, false);
    }
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
  preprocessUploads,
  (req, res, next) => {
    upload(req, res, (err, filename) => {
      if (err) {
        res.redirect("/uploadProfileImage?error=true");
      } else {
        next();
      }
    });
  },
  uploadProfileImage
);

module.exports = router;
