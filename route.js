const router = require("express").Router();
const { createPost, updateNotification, getPosts } = require("./controller");

router.get("/post", getPosts);
router.post("/post", createPost);
router.put("/notification", updateNotification);

module.exports = router;
