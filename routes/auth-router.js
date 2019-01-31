const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const sessionModel = require("../db/models/session-model");

router.post("/login", async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    res.sendStatus(401);
  } else {
    let { userName, password } = req.body;
    try {
      let result = await usersController.verifyUser(userName, password);
      if (result) {
        let authorizationHeader = await usersController.generateSession(
          result._id
        );
        res.setHeader("key", authorizationHeader);
        res.json({ key: authorizationHeader });
      }
    } catch (ex) {
      console.log(ex);
      res.sendStatus(401);
    }
  }
});
//bank
router.post("/logout", async (req, res, next) => {
  if (req.headers.authorization != null) {
    sessionModel.findByIdAndDelete(
      req.headers.authorization,
      (err, results) => {
        if (!err) {
          res.json({ message: "session removed" });
        } else {
          console.log("there is vulnerability with my server");
          res.sendStatus(409);
        }
      }
    );
  }
});

router.get("/verify", async (req, res, next) => {
  if (req.headers.authorization != null) {
    sessionModel.findById(req.headers.authorization, (err, results) => {
      if (results != null) {
        res.status(200).json({ message: "session found" });
      } else {
        console.log("there is vulnerability with my server");
        res.sendStatus(409);
      }
    });
  }
});

module.exports = router;
