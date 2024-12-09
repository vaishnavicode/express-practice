const { v2 } = require("cloudinary");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

v2.config({
  cloud_name: "daxhdgmdb",
  api_key: "626157968284864",
  api_secret: "rzcIkExHDa_4Ud_ZdLmCT1TDBiY",
});

const saveProfilePicture = async (originalname, filename) => {
  const filepath = `C:/Users/Ace PC37/Desktop/Temp/Express/Express Practice/uploads/${originalname}`;
  const uploadResult = await v2.uploader
    .upload(filepath, {
      public_id: `${filename}`,
    })
    .catch((error) => {
      console.log(error);
      return "";
    });

  if (uploadResult && uploadResult.url) {
    fs.unlink(filepath, (err) => {
      if (err) {
        console.log("Error deleting file:", err);
      }
    });
  }

  return uploadResult.url;
};

const convertImage = (usernameFile) => {
  const name = path.parse(`./../../uploads/${usernameFile}`).name;
  sharp(`./../../uploads/${usernameFile}`)
    .toFormat("png")
    .toFile(`./../../uploads/${name}.png`, (err, info) => {
      if (err) {
        console.error("Error during image conversion:", err);
      } else {
        console.log(`Image converted successfully: ${name}.png`);
      }
    });
};

const deleteOlderImages = (directoryPath) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30);

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }

        if (stats.isFile() && stats.birthtime < cutoffDate) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log(`Deleted ${file}`);
            }
          });
        }
      });
    });
  });
};

module.exports = {
  saveProfilePicture,
  convertImage,
  deleteOlderImages,
};
