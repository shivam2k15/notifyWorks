const { Pool } = require("pg");

const pool = new Pool({
  port: process.env.PORT_POSTGRES || 5432, // Default PostgreSQL port,
  user: process.env.USERNAME_POSTGRES,
  database: process.env.DATABASE_POSTGRES,
  host: process.env.HOST_POSTGRES,
  password: process.env.PASSWORD_POSTGRES,
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // How long a client can remain idle before being closed
});

const connectToDB = () => {
  pool
    .connect()
    .then(() => {
      console.log("Connected to PostgreSQL database");
    })
    .catch((err) => {
      console.error("Error connecting to PostgreSQL database", err);
    });
};

module.exports = { connectToDB };
