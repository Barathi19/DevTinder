const validator = require("validator");
const ErrorResponse = require("./errorResponse");
const { CONNECTION_STATUS } = require("../constants");

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

  if (!req.body) {
    throw new ErrorResponse("Empty payload", 400);
  }

  const { url, gender, skills } = req.body;

  // const isEditAllowed = Object.keys(req?.body).every((field) =>
  //   allowedEditFields.includes(field)
  // );

  // if (!isEditAllowed) {
  //   throw new ErrorResponse("Invalid payload", 400);
  // }

  if (url && (typeof url !== "string" || !validator.isURL(val))) {
    throw new ErrorResponse("Invalid URL.", 400);
  } else if (
    gender &&
    (typeof gender !== "string" ||
      !["male", "female", "other"].includes(gender.toLowerCase()))
  ) {
    throw new ErrorResponse("Invalid gender.", 400);
  } else if (
    (skills && !Array.isArray(skills)) ||
    skills.length < 1 ||
    skills.length > 10
  ) {
    throw new ErrorResponse("Skills should be an array with 1 to 10", 400);
  }

  next();
};

const validateUserConnectionRequest = (req, _, next) => {
  const { status, userId } = req.params;
  if (
    !(
      status == CONNECTION_STATUS.INTERESTED ||
      status === CONNECTION_STATUS.IGNORED
    )
  ) {
    throw new ErrorResponse("Invalid status.", 400);
  }

  if (!validator.isMongoId(userId)) {
    throw new ErrorResponse("userId is not a valid ObjectId", 400);
  }

  next();
};

const validateReviewConnectionRequest = (req, _, next) => {
  const { status, requestId } = req.params;
  if (
    !(
      status == CONNECTION_STATUS.ACCEPTED ||
      status === CONNECTION_STATUS.REJECTED
    )
  ) {
    throw new ErrorResponse("Invalid status.", 400);
  }
  if (!validator.isMongoId(requestId)) {
    throw new ErrorResponse("userId is not a valid ObjectId", 400);
  }

  next();
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateUserConnectionRequest,
  validateReviewConnectionRequest,
};
