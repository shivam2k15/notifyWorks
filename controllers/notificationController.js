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

const createNotifications = async (userId, followerIds, title, description) => {
  let text = "",
    values = [];
  for (let id in followerIds) {
    text =
      text +
      `insert into notification (from_user,to_user,title) values ($${
        id + 1
      }, $${id + 2}, $${id + 3});`;

    values = [
      ...values,
      ...[
        userId,
        Number(followerIds[id]), // userId1,
        title, // "why to use postgres",
      ],
    ];
  }
  const query = {
    text,
    values,
  };
  console.log(query, "query");
  const postCreated = await pool.query(query);
};

module.exports = { updateNotification, createNotifications };
