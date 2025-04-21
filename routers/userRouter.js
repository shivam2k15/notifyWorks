const router = require("express").Router();
const { createUser,getUserFollowers } = require("../controllers/userController");

router.post("/", createUser);
router.get("/:userId", getUserFollowers);

module.exports = router;
