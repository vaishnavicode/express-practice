const connection = require("../database/connection");

const postUser = (callback, user) => {
  // Parameterized query to prevent SQL injection
  var addUserQuery = `
    INSERT INTO users (userId, userName, firstName, lastName, email, password, phone, dob, age, address, isAdmin, verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Prepare the values to be inserted, using placeholders (?)
  connection.query(
    addUserQuery,
    [
      user.userId || new Date().getTime(), // Default userId as current timestamp if not provided
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
      return callback(null, true); // Success
    }
  );
};

module.exports = { postUser };
