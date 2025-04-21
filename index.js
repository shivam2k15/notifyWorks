require("dotenv").config(); // Load environment variables
const { createSocketWorker } = require("./workers/socketWorker");
const { createEmailWorker } = require("./workers/emailWorker");
const { connectToDB } = require("./db");
const httpsServer = require("./server");

connectToDB();
createSocketWorker();
createEmailWorker();

//  Start the Server
const port = process.env.PORT || 4001;
// Create HTTPS server
httpsServer.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
