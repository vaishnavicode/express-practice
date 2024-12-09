const clearAllCookies = (req, res) => {
  res.clearCookie("otp", { path: "/" });
  res.clearCookie("lastOtpSentAt", { path: "/" });
  res.clearCookie("email", { path: "/" });
  res.clearCookie("user", { path: "/" });
  res.clearCookie("uploadedImageUrl", { path: "/" });
  res.clearCookie("originalname", { path: "/" });
};

const setUserCookies = (req, res, user) => {
  res.cookie(
    "user",
    JSON.stringify({
      userId: user.userId,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      age: user.age,
      address: user.address,
      verified: user.verified,
      profileImageUrl: user.profileImageUrl,
    }),
    {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    }
  );
};

module.exports = { setUserCookies, clearAllCookies };
