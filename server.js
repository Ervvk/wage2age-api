const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const app = express();

const usersRoutes = require("./routes/users");
const offersRoutes = require("./routes/offers");
const candidatesRoutes = require("./routes/candidate");
const employersRoutes = require("./routes/employer");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

const apiName = "/wage2api";
app.use(apiName, usersRoutes);
app.use(apiName, offersRoutes);
app.use(apiName, candidatesRoutes);
app.use(apiName, employersRoutes);

const port = process.env.PORT || 5000;
app.listen(port);
