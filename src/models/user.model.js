const mongoose = require("mongoose");
const validate = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const { GENDER } = require("../constants");

const userSchema = new mongoose.Schema(
  {
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
      enum: {
        values: Object.values(GENDER),
        message: `{VALUE} is not a valid gender.`,
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
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.getJWT = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
  return token;
};

userSchema.methods.isPasswordMatch = async function (inputPassword) {
  const isMatch = await bcrypt.compare(inputPassword, this.password);
  return isMatch;
};

userSchema.methods.getDetail = function () {
  const detail = this.toJSON();
  delete detail.password;

  return detail;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
