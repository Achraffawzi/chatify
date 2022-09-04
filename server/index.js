const express = require("express");
const flash = require("connect-flash");
const app = express();
require("dotenv").config();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passportSetup = require("./config/passport.js");
require("colors");
require("./config/passport.js");
const cors = require("cors");
const connectDB = require("./config/db");
const { handleApiError } = require("./middlewares/errorHandler");

let onlineUsers = [];

const addUser = (userID, socketID) => {
  const userAlreadyExist = onlineUsers.find((user) => user.userID === userID);

  if (userAlreadyExist) return false;
  onlineUsers.push({ userID, socketID });
  return true;
};

const getUser = (userID) => {
  return onlineUsers.find((user) => user.userID === userID);
};

io.on("connection", (socket) => {
  console.log("new user connected! " + socket.id);

  // Add connected user to online users array
  socket.on("newUser", (userID) => {
    const userAdded = addUser(userID, socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });

  // new message
  socket.on("newMessage", ({ from, to, text }) => {
    console.log(to, from, text);
    const user = getUser(to);
    console.log(user);
    if (user) {
      io.to(user.socketID).emit("getMessage", {
        from,
        text,
      });
    }
  });

  // remove user once disconnected
});

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/chatifyDB",
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/users", require("./routes/users.js"));
app.use("/api/chats", require("./routes/chats.js"));
app.use("/api/messages", require("./routes/messages.js"));

// error middleware
app.use(handleApiError);

const port = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  server.listen(port, () => {
    console.log(`Server running on port ${port}`.bgGreen.bold);
  });
};

startServer();
