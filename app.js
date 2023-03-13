const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HttpError = require("./models/error-model");

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
  .connect(
    "mongodb+srv://Admin-Ehsan:Test123@cluster0.p4ugnh8.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
