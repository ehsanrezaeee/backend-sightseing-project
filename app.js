const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HttpError = require("./models/error-model");
const dotenv = require("dotenv");
dotenv.config();

const placeRoute = require("./routes/places-routes");

const userRoute = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placeRoute);
app.use("/api/users", userRoute);

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

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
