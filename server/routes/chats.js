const router = require("express").Router();
const {
  createChat,
  getChatsByUser,
  getChatByUsers,
} = require("../controllers/chats");

router.post("/new", createChat);
router.get("/:id", getChatsByUser);
router.post("/", getChatByUsers);

module.exports = router;
