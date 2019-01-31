const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//model declaration
const sessionSchema = new Schema(
  {
    _id: String,
    userId: {
      type: String,
      ref: "users"
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  { _id: false }
);

const sessionModel = mongoose.model("sessions", sessionSchema);

module.exports = sessionModel;
