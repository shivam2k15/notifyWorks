const { Client } = require("pg");

const client = new Client({ 
     port: process.env.PORT_POSTGRES,
    user: process.env.USERNAME_POSTGRES,
    database: process.env.DATABASE_POSTGRES,
    host: process.env.HOST_POSTGRES,
    password: process.env.PASSWORD_POSTGRES,
});

const connectToDB = () => {
  client
    .connect()
    .then(() => {
      console.log("Connected to PostgreSQL database");
    })
    .catch((err) => {
      console.error("Error connecting to PostgreSQL database", err);
    });
};

module.exports = { connectToDB };
