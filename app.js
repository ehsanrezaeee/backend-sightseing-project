const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/error-model");

const placeRoute = require("./routes/places-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placeRoute);

app.use((req, res, next) => {
  const error = new HttpError("could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "something went wrong" });
});

app.listen(5000, () => {
  console.log("server is running");
});
