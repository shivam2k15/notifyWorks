const { pool } = require("../db");

const createFollower = async (req, res, next) => {
  try {
    const { userId, followerId } = req.body;

    // Input validation
    if (!userId || !followerId) {
      return next({
        status: 400,
        message: "Ids are required.",
      });
    }

    const insertquery = {
      text: "insert into followers (user_id,follower_id) values ($1, $2);",
      values: [userId, followerId],
    };
    await pool.query(insertquery);
    res.status(201).json({ message: "successfully created" });
  } catch (error) {
    console.error("Error creating follower:", error);
    return next({
      status: 500,
      message: "Error creating follower",
    });
  }
};
const createUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Input validation
    if (!email) {
      return next({
        status: 400,
        message: "Email is required.",
      });
    }
    const query = {
      text: " Select * from users where email= ($1)",
      values: [email],
    };
    let user = await pool.query(query);
    if (user && user.rows.length > 0) {
      return res.json(user.rows[0]);
    }
    const insertquery = {
      text: "insert into users (email) values ($1)",
      values: [email],
    };
    await pool.query(insertquery);

    user = await pool.query(query);
    res.json(user.rows[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    return next({
      status: 500,
      message: "Error creating user",
    });
  }
};
const getUserFollowers = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Input validation
    if (!userId) {
      return next({
        status: 400,
        message: "userId is required.",
      });
    }
    const query = {
      text: " Select name,email from users u join followers f on f.follower_id= u.id where user_id = ($1)",
      values: [userId],
    };

    let user = await pool.query(query);

    res.json(user.rows);
  } catch (error) {
    console.error("Error creating user:", error);
    return next({
      status: 500,
      message: "Error creating user",
    });
  }
};

module.exports = { getUserFollowers, createUser, createFollower };
