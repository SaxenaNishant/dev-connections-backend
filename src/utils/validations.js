const validator = require("validator");

const validateSignUpData = (data) => {
  const { firstName, lastName, email: emailId, password } = data;
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (firstName.length < 4 && firstName.length > 50) {
    throw new Error("First name should be 4-50 characters");
  } else if (lastName.length < 4 && lastName.length > 50) {
    throw new Error("Last name should be 4-50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = new Set([
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ]);

  const filedValidators = {
    gender: (value) => ["male", "female", "others"].includes(value),
    about: (value) => typeof value === "string",
    firstName: (value) =>
      typeof value === "string" && value.length >= 4 && value.length <= 50,
    lastName: (value) =>
      typeof value === "string" && value.length >= 4 && value.length <= 50,
    age: (value) => typeof value === "number" && value >= 18,
    skills: (value) => Array.isArray(value),
    emailId: (value) => validator.isEmail(value),
    photoUrl: (value) => validator.isURL(value),
  };

  const errors = [];

  for (let [key, value] of Object.entries(req.body)) {
    if (!allowedEditFields.has(key)) {
      errors.push(`Invalid field: ${key}`);
    } else if (!filedValidators[key](value)) {
      errors.push(`Invalid value for ${key}`);
    }
  }
  return errors;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
