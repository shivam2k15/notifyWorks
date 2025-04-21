const router = require("express").Router();
const { createPost, getPosts } = require("../controllers/postController");

router.get("/:page", getPosts);
router.post("/", createPost);

module.exports = router;
