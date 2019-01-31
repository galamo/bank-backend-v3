const auth = (req, res, next) => {
  console.log(req.url);
  // if (req.headers.authorization == "token_1234_auth") {
  //   next();
  // } else {
  //   next();
  //   //res.status(404).send("token not found - user unauthorized");
  // }
  next();
};

module.exports = auth;
