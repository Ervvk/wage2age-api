const express = require("express");

const dboperations = require("../dboperations/candidate");
const router = express.Router();

router.use((req, res, next) => {
  console.log("middleware");
  next();
});

router.route("/applications/candidate/:candidateID").get((req, res) => {
  dboperations.getCandidatesApps(req.params.candidateID).then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Failed to load offer applications");
    }
  });
});

module.exports = router;
