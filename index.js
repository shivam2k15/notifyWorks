const express = require("express");
const app = express();
require("dotenv").config(); // Load environment variables
const postRouter = require("./routers/postRouter");
const notificationRouter = require("./routers/notificationRouter");
const { createSocketWorker } = require("./workers/socketWorker");
const { createEmailWorker } = require("./workers/emailWorker");
const { errorHandler } = require("./middleware");
const { connectToDB } = require("./db");

connectToDB();
app.use(express.json());
createSocketWorker();
createEmailWorker();

//  New API Endpoint: Create Post and Notify Followers
//  Added validation and error handling, and uses the queue.
app.use("/post", postRouter);
app.use("/notification", notificationRouter);

app.use(errorHandler);

//  Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
