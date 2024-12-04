const connection = require("../database/connection");

const updateUserVerified = (callback, userId) => {
  var updateVerifiedQuery = `
    UPDATE users
    SET verified = ?
    WHERE userId = ?
  `;

  connection.query(updateVerifiedQuery, ["1", userId], (err, result) => {
    if (err) {
      console.error("Error updating user's verified status: ", err);
      return callback(err, null);
    }
    if (result.affectedRows === 0) {
      return callback(new Error("User not found"), null);
    }
    return callback(null, true);
  });
};

module.exports = { updateUserVerified };
