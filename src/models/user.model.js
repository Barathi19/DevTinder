const mongoose = require("mongoose");
const validate = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required."],
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, "Email ID is required."],
    validate(val) {
      if (!validate.isEmail(val)) {
        throw new ErrorResponse("Invalid Email ID.", 400);
      }
    },
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(val) {
      if (!["male", "female", "other"].includes(val.toLowerCase())) {
        throw new ErrorResponse("Invalid gender.", 400);
      }
    },
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  photoUrl: {
    type: String,
    validate(val) {
      if (!validator.isURL(val)) {
        throw new ErrorResponse("Invalid URL.", 400);
      }
    },
  },
  about: {
    type: String,
  },
  skills: {
    type: [String],
  },
});

userSchema.pre("save", async function () {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.getJWT = function () {
  const token = jwt.sign({ _id: this._id }, "secretissecret", {
    expiresIn: "24h",
  });
  return token;
};

userSchema.methods.isPasswordMatch = async function (inputPassword) {
  const isMatch = await bcrypt.compare(inputPassword, this.password);
  return isMatch;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
