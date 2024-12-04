const clearAllCookies = (req, res) => {
  res.clearCookie("otp");
  res.clearCookie("email");
  res.clearCookie("user");
  return true;
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
    }),
    { expire: 900000 + Date.now() }
  );
  return true;
};

module.exports = { setUserCookies, clearAllCookies };
