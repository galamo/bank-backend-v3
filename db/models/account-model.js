const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//model declaration
const accountSchema = new Schema(
  {
    _id: String,
    accountNumber: {
      type: String
    },
    accountType: {
      type: String,
      default: "personal"
    },
    balance: {
      type: Number,
      default: 0
    },
    owners: {
      type: Array
    },
    createdDate: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

//model registration
const accountModel = mongoose.model("accounts", accountSchema);

module.exports = accountModel;
