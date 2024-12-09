const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

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
  saveProfilePicture,
} = require("../controller/utils/profilePictureFunctions");

const uploadPath =
  "C:/Users/Ace PC37/Desktop/Temp/Express/Express Practice/uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

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

      cb(null, file.originalname);
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
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        console.error("Error during file upload:", err.message || err);
        return res.redirect("/uploadProfileImage?error=true");
      }

      const { uploadOption, profileImageUrl } = req.body;

      if (uploadOption === "file") {
        const file = req.file;
        if (!file) {
          return res.redirect("/uploadProfileImage?error=true");
        }

        const originalname = file.originalname;

        const username = JSON.parse(req.cookies.user).userName;

        const newFilename = `${username}_${new Date().getTime()}`;

        saveProfilePicture(originalname, newFilename)
          .then((url) => {
            res.cookie("uploadedImageUrl", url);
            res.cookie("originalname", originalname);
          })
          .catch((err) => {
            console.error("Error saving profile picture:", err.message || err);
          })
          .finally(() => {
            next();
          });
      } else {
        res.cookie("changedImageUrl", profileImageUrl);
        next();
      }
    });
  },
  uploadProfileImage
);

module.exports = router;
