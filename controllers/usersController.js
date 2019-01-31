const usersModel = require("../db/models/users-model");
const sessionModel = require("../db/models/session-model");
class UsersController {
  static verifyUser(userName, password) {
    return new Promise((resolve, reject) => {
      usersModel.findOne(
        { userName: userName, password: password },
        (err, results) => {
          if (err) reject(err);
          if (!results) reject("User does not exist");
          resolve(results);
        }
      );
    });
  }

  static generateSession(uid) {
    let session = UsersController.uuidv4();
    return new Promise((resolve, reject) => {
      let sessionInstance = new sessionModel({ _id: session, userId: uid });
      sessionInstance.save((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(session);
        }
      });
    });
  }

  static verifySession(session) {
    return new Promise((resolve, reject) => {
      sessionModel.findById(session, (err, result) => {
        if (err) {
          reject("session not exist");
        } else {
          resolve(result);
        }
      });
    });
  }

  static uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

module.exports = UsersController;
