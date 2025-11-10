const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/devTinder");
  console.log("Database connected successfully... ");
};

module.exports = connectDB;
