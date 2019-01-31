const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//model declaration
const cookieSchema = new Schema(
  {
    _id: String,
    exp: {
      type: Date,
      default: Date.now()
    },
    sort: {
      type: String,
      default: "balance"
    },
    history: {
      type: Array
    }
  },
  { _id: false }
);

//model registration
const cookieModel = mongoose.model("cookies", cookieSchema);

module.exports = cookieModel;
