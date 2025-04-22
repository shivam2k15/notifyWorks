const router = require("express").Router();
const { createUser,getUserFollowers,createFollower } = require("../controllers/userController");

router.post("/", createUser);
router.get("/:userId", getUserFollowers);
router.post("/follow", createFollower);

module.exports = router;
