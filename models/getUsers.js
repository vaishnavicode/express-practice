const connection = require("../database/connection");

const getUsers = (callback) => {
  connection.query("SELECT * from users", (err, result) => {
    if (err) {
      console.error("Error fetching users: ", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

module.exports = { getUsers };
