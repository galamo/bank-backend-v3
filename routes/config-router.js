const express = require("express");
const router = express.Router();
const data = require("../model/data");

const accountModel = require("../db/models/account-model");
const usersModel = require("../db/models/users-model");
const cookieController = require("../controllers/cookieController");
const sessionModel = require("../db/models/session-model");

router.get("/seed", (req, res, next) => {
  accountModel.insertMany(data, (err, result) => {
    if (err) res.status(400).json(err);
    res.json(result);
  });
});

router.get("/history", async (req, res, next) => {
  console.log(req.cookies.preferences);
  if (req.cookies.preferences != null) {
    let result = await cookieController.getCookie(req.cookies.preferences);
    console.log(result.history);
    res.json(result.history);
  } else {
    res.json([]);
  }
});

router.post("/adduser", (req, res, next) => {
  if (req.body.userName && req.body.password) {
    let { userName, password } = req.body;
    let generatedId = Math.floor(Math.random() * 999999999);

    let user = new usersModel({ _id: generatedId + "", userName, password });
    user.save((err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send("user added");
      }
    });
  }
});

router.get("/populate", (req, res, next) => {
  sessionModel
    .find()
    .populate("userId")
    .exec((err, result) => {
      res.json(result);
    });
});

module.exports = router;
