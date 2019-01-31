const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//model declaration
const usersSchema = new Schema(
  {
    _id: String,
    userName: {
      type: String
    },
    password: {
      type: String
    }
  },
  { _id: false }
);

const usersModel = mongoose.model("users", usersSchema);

module.exports = usersModel;
