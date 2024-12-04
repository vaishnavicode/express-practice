const connection = require("./database/connection");

const getUsers = (callback) => {
  connection.query("SELECT * from users", (err, result) => {
    if (err) {
      console.log("Error fetching users: ", err.sqlMessage);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

const postUser = (callback, user) => {
  var addUserQuery = `
      INSERT INTO users (userId, userName, firstName, lastName, email, password, phone, dob, age, address, isAdmin, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  connection.query(
    addUserQuery,
    [
      user.userId || new Date().getTime(),
      user.userName,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.phone,
      user.dob,
      user.age,
      user.address,
      user.isAdmin,
      user.verified,
    ],
    (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, true);
    }
  );
};

const updateUserVerified = (callback, userId) => {
  var updateVerifiedQuery = `
      UPDATE users
      SET verified = ?
      WHERE userId = ?
    `;

  connection.query(updateVerifiedQuery, ["1", userId], (err, result) => {
    if (err) {
      console.log("Error updating user's verified status: ", err.sqlMessage);
      return callback(err, null);
    }
    if (result.affectedRows === 0) {
      return callback(new Error("User not found"), null);
    }
    return callback(null, true);
  });
};

module.exports = { getUsers, postUser, updateUserVerified };
