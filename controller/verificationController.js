const users = require("../constant/users").users;
const connection = require("../database/connection");

const verifyEmail = (req, res) => {
  return res.send("Verify");
};

module.exports = { verifyEmail };
