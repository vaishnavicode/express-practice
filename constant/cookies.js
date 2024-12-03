const clearAllCookies = (req, res) => {
  res.clearCookie("otp");
  res.clearCookie("email");
  res.clearCookie("user");
  return true;
};

const setCookies = (req, res, user) => {
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
    { maxAge: 900000 }
  );
  return true;
};

module.exports = { setCookies, clearAllCookies };
