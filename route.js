const router = require("express").Router();
const { createPost, updateNotification } = require("./controller");

router.post("/post", createPost);
router.put("/notification", updateNotification);

module.exports = router;
