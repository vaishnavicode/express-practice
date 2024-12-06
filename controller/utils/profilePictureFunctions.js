const { v2 } = require("cloudinary");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Configuration
v2.config({
  cloud_name: "daxhdgmdb",
  api_key: "626157968284864",
  api_secret: "rzcIkExHDa_4Ud_ZdLmCT1TDBiY",
});

const saveProfilePicture = async (id) => {
  // Upload an image
  const uploadResult = await v2.uploader
    .upload(
      "https://static.wikia.nocookie.net/disney/images/9/96/Studio_Ghibli_Logo.jpg/revision/latest?cb=20140621101318",
      {
        public_id: `${id}`,
      }
    )
    .catch((error) => {
      console.log(error);
    });

  uploadResult;
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

const deleteOlderImages = () => {
  const directoryPath =
    "C:/Users/Ace PC37/Desktop/Temp/Express/Express Practice/uploads";

  cutoffDate.setDate(new Date().getDate() - 30);

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

const renameOtherPictures = (usernameFile) => {
  const directoryPath =
    "C:/Users/Ace PC37/Desktop/Temp/Express/Express Practice/uploads";

  const files = fs.readdirSync(directoryPath);

  const filteredFiles = files.filter((file) =>
    file.startsWith(usernameFile + "_")
  );

  filteredFiles.sort((a, b) => {
    const numA = parseInt(a.match(/_(\d+)/)?.[1] || "0", 10);
    const numB = parseInt(b.match(/_(\d+)/)?.[1] || "0", 10);
    return numB - numA;
  });

  filteredFiles.forEach((file, index) => {
    const extension = path.extname(file);
    const newName = `${usernameFile}_${
      parseInt(file.match(/_(\d+)/)?.[1] || "0", 10) + 1
    }${extension}`;
    const oldPath = path.join(directoryPath, file);
    const newPath = path.join(directoryPath, newName);

    try {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${file} -> ${newName}`);
    } catch (error) {
      console.error(`Error renaming ${file}:`, error.message);
    }
  });
};

module.exports = {
  saveProfilePicture,
  renameOtherPictures,
  convertImage,
  deleteOlderImages,
};
