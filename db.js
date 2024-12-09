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

const getPastProfileImages = (callback, userId) => {
  var pastProfileImageQuery = `SELECT * from user_profile_pictures where userId=? AND active = FALSE`;
  connection.query(pastProfileImageQuery, [userId], (err, result) => {
    if (err) {
      console.log("Error fetching users: ", err.sqlMessage);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

const deleteUser = (callback, userId) => {
  var deleteQuery = `Delete from users where userId=?`;
  connection.query(deleteQuery, [userId], (err, result) => {
    if (err) {
      console.log("Error fetching users: ", err.sqlMessage);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

const postUser = (callback, user) => {
  var addUserQuery = `
      INSERT INTO users (userId, userName, firstName, lastName, email, password, phone, dob, address, isAdmin, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

const updateUserDetails = (
  userId,
  firstName,
  lastName,
  phone,
  dob,
  address,
  profileImageUrl,
  connection
) => {
  const query = `
    UPDATE users
    SET firstName = ?, lastName = ?, phone = ?, dob = ?, address = ?, profileImageUrl = ?
    WHERE userId = ?
  `;

  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [firstName, lastName, phone, dob, address, profileImageUrl, userId],
      (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0)
          return reject(new Error("User not found"));
        resolve();
      }
    );
  });
};

const deactivateOldProfilePictures = (userId, connection) => {
  const query = `
    UPDATE user_profile_pictures
    SET active = FALSE
    WHERE userId = ?
  `;

  return new Promise((resolve, reject) => {
    connection.query(query, [userId], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const addNewProfilePicture = (
  userId,
  profileImageUrl,
  originalname,
  connection
) => {
  const query = `
    INSERT INTO user_profile_pictures (userId, filename, profileImageUrl, uploadDate, active)
    VALUES (?, ?, ?, NOW(), ?)
  `;

  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [userId, originalname, profileImageUrl, true],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

const commitTransaction = (connection) => {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const rollbackTransaction = (connection) => {
  return new Promise((resolve) => {
    connection.rollback(() => resolve());
  });
};

const editUser = async (
  callback,
  firstName,
  lastName,
  phone,
  dob,
  address,
  userId,
  profileImageUrl,
  profileChanged,
  originalname
) => {
  try {
    await connection.beginTransaction();

    await updateUserDetails(
      userId,
      firstName,
      lastName,
      phone,
      dob,
      address,
      profileImageUrl,
      connection
    );

    await deactivateOldProfilePictures(userId, connection);

    if (profileChanged) {
      await addNewProfilePicture(
        userId,
        profileImageUrl,
        originalname,
        connection
      );
    }

    await commitTransaction(connection);

    callback(null, true);
  } catch (err) {
    console.error(
      "Error during user update process:",
      err.message || err.sqlMessage
    );
    await rollbackTransaction(connection);
    callback(err, null);
  }
};

module.exports = {
  getUsers,
  postUser,
  updateUserVerified,
  editUser,
  getPastProfileImages,
  deleteUser,
};
