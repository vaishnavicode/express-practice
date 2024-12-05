const { v2 } = require("cloudinary");

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

module.exports = { saveProfilePicture };
