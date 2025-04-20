const router = require("express").Router();
const { updateNotification } = require("../controllers/notificationController");

router.patch("/", updateNotification);

module.exports = router;
