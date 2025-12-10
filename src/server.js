require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/connectionRequest");
const userRouter = require("./routes/user");
const cors = require("cors");
const http = require("http");
const { initializeSocket } = require("./utils/socket");
const chatRouter = require("./routes/chat");
// require("./utils/crons");

const PORT = 3000;

const app = express();
const server = http.createServer(app);

// init Web Socket
initializeSocket(server);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

app.use(errorHandler);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Database Connection Error: " + err);
  });
