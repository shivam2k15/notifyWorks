const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config(); // Load environment variables
const postRouter = require("./routers/postRouter");
const notificationRouter = require("./routers/notificationRouter");
const userRouter = require("./routers/userRouter");
const { createSocketWorker } = require("./workers/socketWorker");
const { createEmailWorker } = require("./workers/emailWorker");
const { errorHandler } = require("./middleware");
const { connectToDB } = require("./db");
const httpsServer = require("./server");

app.use(helmet());
app.use(cors());
connectToDB();
app.use(express.json());
createSocketWorker();
createEmailWorker();

//  New API Endpoint: Create Post and Notify Followers
//  Added validation and error handling, and uses the queue.
app.use("/post", postRouter);
app.use("/notification", notificationRouter);
app.use("/user", userRouter);

app.use(errorHandler);

//  Start the Server
const port = process.env.PORT || 4001;
app.get("/", (req, res) => {
  res.send("🔒 Hello from secure EC2!");
});

// Create HTTPS server
httpsServer.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
