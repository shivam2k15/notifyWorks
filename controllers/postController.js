const { Queue } = require("bullmq");
const { pool } = require("../db");
const { getEmailJob } = require("../workers/emailWorker");
const { createNotifications } = require("./notificationController");

//  Configure BullMQ Queue (for Jobs)
const socketQueue = new Queue("socket-queue", {
  connection: {
    host: "localhost", // Default Redis host
    port: 6379, // Default Redis port
  },
});

const getSocketJob = async (userId, followerIds, title) => {
  const job = await socketQueue.add(
    "send-notification",
    {
      from: userId,
      to: followerIds,
      title: `New Post: ${title}`,
    },
    {
      // Add this to each job, so individual jobs can have their own options.
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  );
  return job;
};


const getPosts = async (req, res, next) => {
  try {
    const { page } = req.params;
    let limit = 10;
    const response = await pool.query(
      `select * from posts ORDER BY created_at desc LIMIT ${limit} OFFSET ${
        limit * (Number(page) - 1)
      }`
    );
    res.json(response.rows);
  } catch (error) {
    return next({
      status: 500,
      message: error.message || "Something went Wrong",
    });
  }
};

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

    const followerEmails = await getFollowerEmails(userId); // Await the promise
    if (!followerEmails || followerEmails.length === 0) {
      return res
        .status(200)
        .json({ message: "Post created, but no followers to notify." }); //  No followers is not an error.
    }
    let allEmails = followerEmails.map((item) => item.email);
    let allIds = followerEmails.map((item) => item.id);
    // Add a job to the queue for sending emails

    await Promise.allSettled([
      getEmailJob(allEmails, title, description),
      getSocketJob(userId, allIds, title),
      createNotifications(userId, allIds, title, description),
    ]);

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
    text: "SELECT email, users.id as id FROM users join followers f on f.follower_id=users.id  WHERE f.user_id = $1",
    values: [
      userId, // userId1,
    ],
  };
  const allEmails = await pool.query(query);
  return allEmails.rows;
};

module.exports = { createPost, getPosts };
