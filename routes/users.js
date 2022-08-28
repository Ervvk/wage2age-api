const express = require("express");

const dboperations = require("../dboperations/users");
const router = express.Router();
router.use((req, res, next) => {
  console.log("middleware");
  next();
});

router.route("/users").get((req, res) => {
  dboperations.getUsers().then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Failed to load users");
    }
  });
});

router.route("/auth/:creds").get((req, res) => {
  dboperations.authUser(JSON.parse(req.params.creds)).then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Incorrect credentials");
    }
  });
});

router.route("/users").post((req, res) => {
  dboperations.addNewUser(req.body).then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Incorrect user data");
    }
  });
});

module.exports = router;
