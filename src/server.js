const express = require("express");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/error");
const authRouter = require("./routes/auth");

const PORT = 3000;

const app = express();

app.use(express.json());

app.use("/", authRouter);

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
