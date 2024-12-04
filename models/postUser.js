const connection = require("../database/connection");

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
        console.error("Error inserting user: ", err);
        return callback(err, null);
      }
      return callback(null, true);
    }
  );
};

module.exports = { postUser };
