const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const postRouter = require("./routers/postRouter");
const notificationRouter = require("./routers/notificationRouter");
const userRouter = require("./routers/userRouter");
const { errorHandler } = require("./middleware");

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/post", postRouter);
app.use("/notification", notificationRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("🔒 Hello from secure EC2!");
});

app.use(errorHandler);
module.exports = app;
