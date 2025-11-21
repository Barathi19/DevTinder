const express = require("express");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/connectionRequest");
const userRouter = require("./routes/user");
const cors = require("cors");
require("dotenv").config();

const PORT = 3000;

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Database Connection Error: " + err);
  });
