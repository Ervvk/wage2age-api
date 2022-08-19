const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const app = express();
const router = express.Router();

const usersRoutes = require("./routes/users");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const apiName = "/wage2api";
app.use(apiName, usersRoutes);

const port = process.env.PORT || 5000;
app.listen(port);
