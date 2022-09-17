const router = require("express").Router();
const {
  createChat,
  getChatsByUser,
  getChatByUsers,
} = require("../controllers/chats");
const isAuth = require("../middlewares/isAuth");

router.post("/new", isAuth, createChat);
router.get("/:id", isAuth, getChatsByUser);
router.get("/:userOne/:userTwo", isAuth, getChatByUsers);

module.exports = router;
