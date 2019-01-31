const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:SS" }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "logger/debug.log",
      level: "debug"
    }),
    new winston.transports.File({
      filename: "logger/operations.log",
      level: "verbose"
    })
  ]
});

module.exports = logger;
