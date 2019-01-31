const accountModel = require("../db/models/account-model");

class AccountController {
  static getAccounts(params = {}, select = {}, options = {}) {
    return new Promise((resolve, reject) => {
      accountModel.find(params, select, options, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  static delAccount(id) {
    return new Promise((resolve, reject) => {
      accountModel.findByIdAndDelete(id, (err, result) => {
        if (err) reject(err);
        else if (result != null) {
          resolve(`Account ${result._id} deleted`);
        } else {
          resolve(`Account ${id} Not Exist`);
        }
      });
    });
  }

  static updateAccount(objectInput) {
   
    let query = {};
    if (objectInput.operation == "deposit") {
      query = {
        createdDate: new Date(),
        $inc: { balance: parseInt(objectInput.amount) }
      };
    } else {
      query = {
        createdDate: new Date(),
        $inc: { balance: "-" + parseInt(objectInput.amount) }
      };
    }
    return new Promise((resolve, reject) => {
      accountModel.findOneAndUpdate(
        { _id: objectInput.accountId },
        query,
        { new: true },
        (err, result) => {
          if (err) reject(err);
          else if (result != null) {
          
            resolve(result);
          } else {
            resolve(`Account ${id} Not Exist`);
          }
        }
      );
    });
  }
}

module.exports = AccountController;
