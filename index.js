const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const logger = require("./logger/logger");
const auth = require("./auth/middleware-auth");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const http = require("http");
//routes
const cp = require("cookie-parser");
const mongoose = require("mongoose");
const mock = require("./model/data");
const opertaiontsRouter = require("./routes/operations-router");
const authRouter = require("./routes/auth-router");
const configuration = require("./routes/config-router");
const accountRouter = require("./routes/accounts-router");
const CookieController = require("./controllers/cookieController");
const UsersController = require("./controllers/usersController");

mongoose.connect(
  "mongodb://localhost/BankApplication",
  { useNewUrlParser: true }
);

var customCors = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
};
// app.use(cors());
app.use(customCors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auth);
app.use(cp());

//schema name:BankApplication
mongoose.connect(
  "mongodb://localhost/BankApplication",
  { useNewUrlParser: true }
);

app.use(async (req, res, next) => {
  console.log("what is my cookie?", req.cookies.preferences);
  if (req.cookies.preferences == null) {
    console.log("new cookie set?");

    let experationDate = Date.now();
    experationDate += 90000000;

    let number = Math.floor(Math.random() * 9999999);
    let cookieFromDb = await CookieController.setCookie(
      number,
      new Date(experationDate)
    );
    console.log(cookieFromDb);
    let cookie = res.cookie("preferences", number, {
      maxAge: 90000000,
      httpOnly: true
    });
  } else {
    let existingCookie = await CookieController.getCookie(
      req.cookies.preferences
    );
    req.cookieData = existingCookie;
  }
  next();
});

app.use("/auth", authRouter);
app.use("/config", configuration);
app.use(async (req, res, next) => {
  console.log("auth", req.headers.authorization);
  if (req.headers.authorization) {
    try {
      let currentUser = await UsersController.verifySession(
        req.headers.authorization
      );

      if (!currentUser) throw new Error("session was not found");
      req.currentUser = currentUser;
      next();
    } catch (ex) {
      res.status(401).json({ ex: ex.message });
    }
  } else {
    res.status(401).json({ message: "authentication failed" });
  }
});

app.use("/accounts", accountRouter);
app.use("/operations", opertaiontsRouter);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send(error);
});
const port = process.env.PORT || 3200;
const server = http.createServer(app);

server.listen(port, error => {
  if (error) {
    console.log(error);
  } else {
    console.log(`listen to port ${port}`);
  }
});

// const io = socketIo(server); // < Interesting!

// io.on("connection", socket => {
//   console.log("client connected");
//   socket.on("account_added_to_client", () => {
//     console.log("account added!!!");
//     io.emit("account_added_to_client", "account added!");
//   });
//   socket.on("disconnect", () => console.log("Client disconnected"));
// });
