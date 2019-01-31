const accounts = [];
var Fakerator = require("fakerator");
var fakerator = Fakerator();

const types = ["business", "student", "private", "company"];

class Account {
  constructor(_id, _account_number, _type, _owner, _balance, _created_date) {
    this._id = _id;
    this.accountNumber = _account_number;
    this.accountType = _type;
    this.owners = _owner;
    this.balance = _balance;
    this.createdDate = _created_date;
  }
}

const genOwners = () => {
  let names = [];
  let numberOfOwners = Math.floor(Math.random() * 3) + 1;
  for (let index = 0; index < numberOfOwners; index++) {
    names.push(fakerator.names.name());
  }
  return names;
};
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toLocaleString();
};

for (let index = 0; index < 100; index++) {
  const current = new Account(
    Math.floor(Math.random() * 999999),
    "account" +
      Math.floor(Math.random() * 999) +
      "-" +
      Math.floor(Math.random() * 999999),
    types[Math.floor(Math.random() * 4)],
    genOwners(),
    Math.floor(Math.random() * 1234),
    randomDate(new Date(2012, 0, 1), new Date())
  );
  accounts.push(current);
}
module.exports = accounts;
