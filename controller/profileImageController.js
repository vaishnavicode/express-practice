const multer = require("multer");
const fs = require("fs");
const path = require("path");
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

const uploadProfileImage = (req, res) => {
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
          res.redirect("/editProfile");
        });
    } else {
      res.cookie("changedImageUrl", profileImageUrl);
      res.redirect("/editProfile");
    }
  });
};

module.exports = { uploadProfileImage };
