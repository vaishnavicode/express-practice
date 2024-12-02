export const getUsers = (error, results) => {
  if (error) {
    console.error("Error fetching users from the database: " + error.stack);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
  return results;
};
