const express = require("express");
const router = express.Router();
const data = require("../model/data");
const logger = require("../logger/logger");
const fs = require("fs");
const accountModel = require("../db/models/account-model");
const mongoose = require("mongoose");
const accountController = require("../controllers/accountController");
const cookieController = require("../controllers/cookieController");



router.get("/all", async (req, res, next) => {
  try {
    const results = await accountController.getAccounts(req.query);
    res.json(results);
  } catch (ex) {
    res
      .status(409)
      .json({ message: "there is a conflict with my understanding", real: ex });
  }
});

router.get("/:skip/:take/:sort", async (req, res, next) => {
  console.log("trasfered cookie", req.cookieData);
  try {
    if (req.params.sort != "undefined") {
      await cookieController.updateCookie(req.cookies.preferences, {
        sort: req.params.sort
      });
    }

    let documentCookie = await cookieController.getCookie(
      req.cookies.preferences
    );
    let sortOptions = "balance";
    if (documentCookie) {
      sortOptions = documentCookie.sort;
    }

    const results = await accountController.getAccounts(
      {},
      { __v: 0 },
      {
        sort: "-" + sortOptions,
        skip: parseInt(req.params.skip),
        limit: parseInt(req.params.take)
      }
    );
    res.json(results);
  } catch (ex) {
    console.log(ex);
    res
      .status(409)
      .json({ message: "there is a conflict with my understanding", real: ex });
  }
});

router.get("/:id", async (req, res, next) => {
  if (req.params.id) {
    await cookieController.updateCookie(
      { _id: req.cookies.preferences },
      { $push: { history: req.params.id } }
    );
  }

  try {
    const results = await accountController.getAccounts(
      { _id: req.params.id },
      { __v: 0 },
      {}
    );
    res.json(results[0]);
  } catch (ex) {
    res
      .status(409)
      .json({ message: "there is a conflict with my understanding", real: ex });
  }
});

router.post("/", (req, res, next) => {
  logger.debug("create account");
  try {
    data[0] = req.body;
    res.json({ message: `account ${req.body.id} added`, result: true });
  } catch (ex) {
    res.status(500).json({ message: ex, result: false });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const results = await accountController.delAccount(req.params.id);
    res.json({ message: results });
  } catch (ex) {
    res
      .status(409)
      .json({ message: "there is a conflict with my understanding", real: ex });
  }
});

router.put("/", async (req, res, next) => {
  try {
    const results = await accountController.updateAccount(req.body);
    res.json({ message: results });
  } catch (ex) {
    res
      .status(409)
      .json({ message: "there is a conflict with my understanding", real: ex });
  }
});

module.exports = router;
