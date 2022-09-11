const router = require("express").Router();
const {
  createChat,
  getChatsByUser,
  getChatByUsers,
} = require("../controllers/chats");

router.post("/new", createChat);
router.get("/:id", getChatsByUser);
router.get("/:userOne/:userTwo", getChatByUsers);

module.exports = router;
