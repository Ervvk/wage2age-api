const express = require("express");
const dboperations = require("../dboperations/employer");
const router = express.Router();

router.use((req, res, next) => {
  console.log("middleware");
  next();
});

router.route("/offers/:companyID").get((req, res) => {
  dboperations.getCompanyOffers(req.params.companyID).then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Failed to load company offers");
    }
  });
});

router.route("/offers/apps/:offerID").get((req, res) => {
  dboperations.getOfferCandidates(req.params.offerID).then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Failed to load company job applications");
    }
  });
});

router.route("/offers/apps").put((req, res) => {
  dboperations.updateJobAppState(req.body).then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Failed to update job app state");
    }
  });
});

module.exports = router;
