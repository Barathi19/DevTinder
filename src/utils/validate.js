const validator = require("validator");
const ErrorResponse = require("./errorResponse");

const validateSignUpData = (req, _, next) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName && !lastName) {
    throw new ErrorResponse("Name is not valid!", 400);
  } else if (!emailId || !validator.isEmail(emailId)) {
    throw new ErrorResponse("Email is not valid!", 400);
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new ErrorResponse("Please enter a strong Password!", 400);
  }
  
  next();
};

const validateEditProfileData = (req, _, next) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  if (!isEditAllowed) {
    throw new ErrorResponse("Invalid payload", 400);
  }

  if (url && !validator.isURL(val)) {
    throw new ErrorResponse("Invalid URL.", 400);
  } else if (
    gender &&
    !["male", "female", "other"].includes(val.toLowerCase())
  ) {
    throw new ErrorResponse("Invalid gender.", 400);
  }

  next();
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
