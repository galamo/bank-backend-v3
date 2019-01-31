const express = require("express");
const router = express.Router();
const data = require("../model/data");
const logger = require("../logger/logger");
const fs = require("fs");

router.post("/", (req, res, next) => {
  logger.debug("create operation");
  try {
    logger.verbose(req.body);
    res.send("operation added!");
  } catch (ex) {
    res.status(500).json({ message: ex, result: false });
  }
});

router.get("/export_operations/:file", (req, res, next) => {
  logger.debug("create export_operations");
  try {
    res.download(`./logger/${req.params.file}`);
  } catch (ex) {
    res.status(500).json({ message: ex, result: false });
  }
});

// router.get("/read_operations/:file", (req, res, next) => {
//   logger.debug("create export_operations");
//   try {
//     fs.readFile(`./logger/${req.params.file}`, "utf8", (err, data) => {
//       if (err) {
//         res.send(err);
//       } else {
//       }
//     });
//   } catch (ex) {
//     res.status(500).json({ message: ex, result: false });
//   }
// });

module.exports = router;
