export function validateUser(user) {
  const errors = [];

  // Check if required fields are not empty
  if (!user.userName || user.userName.trim() === "") {
    errors.push("User name is required.");
  }
  if (!user.firstName || user.firstName.trim() === "") {
    errors.push("First name is required.");
  }
  if (!user.lastName || user.lastName.trim() === "") {
    errors.push("Last name is required.");
  }
  if (!user.email || user.email.trim() === "") {
    errors.push("Email is required.");
  }
  if (!user.password || user.password.trim() === "") {
    errors.push("Password is required.");
  }
  if (!user.confirmPassword || user.confirmPassword.trim() === "") {
    errors.push("Confirm password is required.");
  }
  if (!user.phone || user.phone.trim() === "") {
    errors.push("Phone number is required.");
  }
  if (!user.dob || user.dob.trim() === "") {
    errors.push("Date of birth is required.");
  }
  if (!user.address || user.address.trim() === "") {
    errors.push("Address is required.");
  }

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (user.email && !emailRegex.test(user.email)) {
    errors.push("Email is not valid.");
  }

  // Validate phone number format (assuming a 10-digit number)
  const phoneRegex = /^\d{10}$/; // assuming phone numbers are 10 digits long
  if (user.phone && !phoneRegex.test(user.phone)) {
    errors.push("Phone number must be 10 digits.");
  }

  // Check if password and confirmPassword match
  if (user.password !== user.confirmPassword) {
    errors.push("Password and confirm password do not match.");
  }

  // Password strength check: at least 8 characters, 1 number, 1 special character
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (user.password && !passwordRegex.test(user.password)) {
    errors.push(
      "Password must be at least 8 characters long, contain at least one number and one special character."
    );
  }

  // If there are validation errors, return them; otherwise, return null
  if (errors.length > 0) {
    return errors;
  } else {
    return null; // No errors, valid input
  }
}
