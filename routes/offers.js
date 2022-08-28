const express = require("express");
const dboperations = require("../dboperations/offers");
const router = express.Router();

router.use((req, res, next) => {
  console.log("middleware");
  next();
});

router.route("/offers").get((req, res) => {
  dboperations.getOffers().then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Failed to load offers");
    }
  });
});

router.route("/offer/:offerID").get((req, res) => {
  dboperations.getOfferByID(req.params.offerID).then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Failed to load offer");
    }
  });
});

router.route("/offer/:offerID").get((req, res) => {
  dboperations.getOfferByID(req.params.offerID).then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Failed to load offer");
    }
  });
});

router.route("/offers").post((req, res) => {
  dboperations.addNewOffer(req.body).then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Failed to add a new offer");
    }
  });
});

router.route("/offers/apply").post((req, res) => {
  dboperations.addNewJobApp(req.body).then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Failed to post a job application");
    }
  });
});

module.exports = router;
