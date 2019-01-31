const axios = require("axios");

axios
  .post("http://localhost:2200/auth/login", {
    userName: "gal",
    password: "1234"
  })
  .then(function(response) {
    console.log(response.data);
  })
  .catch(function(error) {
    console.log("sss");
  });
