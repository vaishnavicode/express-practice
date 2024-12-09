const uploadProfileImage = (req, res) => {
  const { uploadOption, profileImageUrl } = req.body;
  console.log(uploadOption, profileImageUrl);

  res.redirect("/editProfile");
};

module.exports = { uploadProfileImage };
