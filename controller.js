// const { getJob } = require("./emailWorker");

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

    const followerEmails = await getFollowerEmails(userId); // Await the promise
    if (!followerEmails || followerEmails.length === 0) {
      return res
        .status(200)
        .json({ message: "Post created, but no followers to notify." }); //  No followers is not an error.
    }

    // 2. Add a job to the queue for sending emails
    // let job = await getJob(followerEmails, title, description);

    // console.log(
    //   `Email job added to queue for post: ${title}, Job ID: ${job.id}`
    // );

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
};

const getPosts = async (req, res, next) => {
  res.json({
    message: "Hello good to see you happy",
  });
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
