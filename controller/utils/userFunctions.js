const calculateAge = (dob) => {
  dob = new Date(dob.split("-"));
  var today = new Date();

  return today.getFullYear() - dob.getFullYear();
};
const validateUser = (user) => {
  const errors = {};

  // User name validation
  if (!user.userName || user.userName.trim() === "") {
    errors["userName"] = "User name is required.";
  }

  // First name validation
  if (!user.firstName || user.firstName.trim() === "") {
    errors["firstName"] = "First name is required.";
  }

  // Last name validation
  if (!user.lastName || user.lastName.trim() === "") {
    errors["lastName"] = "Last name is required.";
  }

  // Email validation
  if (!user.email || user.email.trim() === "") {
    errors["email"] = "Email is required.";
  } else {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(user.email)) {
      errors["email"] = "Email is not valid.";
    }
  }

  // Password validation
  if (!user.password || user.password.trim() === "") {
    errors["password"] = "Password is required.";
  } else {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(user.password)) {
      errors["password"] =
        "Password must be at least 8 characters long, contain at least one number and one special character.";
    }
  }

  // Confirm password validation
  if (!user.confirmPassword || user.confirmPassword.trim() === "") {
    errors["confirmPassword"] = "Confirm password is required.";
  } else if (user.password !== user.confirmPassword) {
    errors["confirmPassword"] = "Password and confirm password do not match.";
  }

  // Phone number validation
  if (!user.phone || user.phone.trim() === "") {
    errors["phone"] = "Phone number is required.";
  } else {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(user.phone)) {
      errors["phone"] = "Phone number must be 10 digits.";
    }
  }

  // Date of birth validation
  if (!user.dob || user.dob.trim() === "") {
    errors["dob"] = "Date of birth is required.";
  }

  // Address validation
  if (!user.address || user.address.trim() === "") {
    errors["address"] = "Address is required.";
  }

  // Profile image URL validation
  if (!user.profileImageUrl || user.profileImageUrl.trim() === "") {
    errors["profileImageUrl"] = "Profile image URL is required.";
  } else {
    const imageUrlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|svg))$/i;
    if (!imageUrlRegex.test(user.profileImageUrl)) {
      errors["profileImageUrl"] = `Profile image URL must be a valid image URL 
        (png, jpg, jpeg, gif, bmp, svg).`;
    }
  }

  // Return errors object if there are any errors, otherwise return null
  if (Object.keys(errors).length > 0) {
    return errors;
  } else {
    return null;
  }
};

const validateProfileImageUrl = (filename) => {
  if (!filename) {
    return {
      error: { profileImageUrl: "Profile image file name is required." },
    };
  }

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];
  const fileExtension = filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();

  if (!allowedExtensions.includes(`.${fileExtension}`)) {
    return {
      profileImageUrl:
        "Profile image must have a valid image extension (JPG, JPEG, PNG, GIF, BMP, SVG).",
    };
  }

  return null;
};

module.exports = { calculateAge, validateUser, validateProfileImageUrl };
