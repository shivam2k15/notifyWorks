const express = require("express");
const { errorHandler } = require("./middleware");
require("dotenv").config(); // Load environment variables
const route = require("./route");
// const worker = require("./emailWorker");

const app = express();
app.use(express.json());

//  New API Endpoint: Create Post and Notify Followers
//  Added validation and error handling, and uses the queue.
app.post("/", route);

//   Error Handling Middleware (Optional, but recommended)
app.use(errorHandler);

//  Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
