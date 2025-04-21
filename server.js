const https = require("https");
const fs = require("fs");
const app = require("./app");
// Read certs
const sslOptions = {
  key: fs.readFileSync("./ssl/server.key"),
  cert: fs.readFileSync("./ssl/server.cert"),
};

const httpsServer = https.createServer(sslOptions, app);

module.exports = httpsServer;
