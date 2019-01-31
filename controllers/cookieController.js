const cookieModel = require("../db/models/cookie-model");

class CookieController {
  static getCookie(id) {
    return new Promise((resolve, reject) => {
      cookieModel.findById(id, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static updateCookie(id, newObject) {
    return new Promise((resolve, reject) => {
      cookieModel.findOneAndUpdate(
        { _id: id },
        newObject,
        { new: true },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  static setCookie(id, date) {
    return new Promise((resolve, reject) => {
      let cookie = { _id: id, exp: date, sort: "balance", history: [] };
      let model = new cookieModel(cookie);

      model.save((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = CookieController;
