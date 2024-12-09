const { v2 } = require("cloudinary");
const fs = require("fs");

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

module.exports = {
  saveProfilePicture,
};
