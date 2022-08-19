const express = require("express");

const dboperations = require("../dboperations/users");
const router = express.Router();
router.use((req, res, next) => {
  console.log("middleware");
  next();
});

router.route("/users").get((req, res) => {
  dboperations.getUsers().then((result) => {
    res.json(result);
  });
});

module.exports = router;
