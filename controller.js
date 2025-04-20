const { getJob } = require("./emailWorker");
const { pool } = require("./db");

const createPost = async (req, res, next) => {
  try {
    const { title, description, userId } = req.body;

    // Input validation
    if (!title || !description || !userId) {
      return next({
        status: 400,
        message: "Title, description, and userId are required.",
      });
    }

    const query = {
      text: "insert into posts (user_id,title,description) values ($1, $2, $3)",
      values: [
        userId, // userId1,
        title, // "why to use postgres",
        description, // "we should use sql databse for complex relation based table data",
      ],
    };
    const postCreated = await pool.query(query);
    console.log(postCreated, "post");

    const followerEmails = await getFollowerEmails(userId); // Await the promise
    console.log(followerEmails, "followerEmails");
    if (!followerEmails || followerEmails.length === 0) {
      return res
        .status(200)
        .json({ message: "Post created, but no followers to notify." }); //  No followers is not an error.
    }

    // Add a job to the queue for sending emails
    let job = await getJob(followerEmails, title, description);

    console.log(
      `Email job added to queue for post: ${title}, Job ID: ${job.id}`
    );

    res.status(201).json({
      message: "Post created and notifications queued.",
    }); // 201 Created
  } catch (error) {
    console.error("Error creating post or sending notifications:", error);
    return next({
      status: 500,
      message: "Error creating post or sending notifications",
    });
  }
};

const getFollowerEmails = async (userId) => {
  console.log(`Fetching follower emails for user: ${userId}`);
  const query = {
    text: "SELECT email FROM users join followers f on f.follower_id=users.id  WHERE f.user_id = $1",
    values: [
      userId, // userId1,
    ],
  };
  const allEmails = await pool.query(query);
  return allEmails.rows.map(item=>item.email);
};

const getPosts = async (req, res, next) => {
  try {
    const response = await pool.query("select * from posts");
    res.json(response.rows);
  } catch (error) {
    return next({
      status: 500,
      message: error.message || "Something went Wrong",
    });
  }
};

const updateNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.body;

    // Input validation
    if (!notificationId) {
      return next({
        status: 400,
        message: "notificationId is required.",
      });
    }
    res.json({ message: "Updated Succesfully" });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return next({
      status: 500,
      message: "Error updating notifications",
    });
  }
};

module.exports = { createPost, updateNotification, getPosts };
