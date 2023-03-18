const { uuid } = require("uuidv4");
const Place = require("../models/place");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/error-model");
const getCoordsForAddress = require("../util/location");
const User = require("../models/user");

// Dummy_Places = [
//   {
//     id: "p1",
//     title: "Milad Tower",
//     description: "Tallest building in Iran",
//     imageUrl: "https://tasteiran.net/Files/milad-tower-tehran-9ed0a9.jpg",
//     address: "Tehran, Tehran Province",
//     location: {
//       lat: 35.7448416,
//       lng: 51.3731325,
//     },
//     creator: "u1",
//   },
//   {
//     id: "p2",
//     title: "Milad Tower",
//     description: "Tallest building in Iran",
//     imageUrl: "https://tasteiran.net/Files/milad-tower-tehran-9ed0a9.jpg",
//     address: "Tehran, Tehran Province",
//     location: {
//       lat: 35.7448416,
//       lng: 51.3731325,
//     },
//     creator: "u2",
//   },
// ];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("somthing went wrong", 500);
    return next(error);
  }

  if (!place) {
    return next(new HttpError("could not find a place", 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getplacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError("somthing went wrong fucked", 500);
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(new HttpError("could not find a place", 404));
  }
  res.json({ place: places.map((place) => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid data", 422));
  }

  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image: "http://www.poliran.org/uploads/project/structure/milad.jpg",
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("creating place failed", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("coul not find user for provided Id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("creating place failed, try again", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const UpdatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid data", 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("somthing went wrong", 500);
    return next(error);
  }

  if (!place) {
    return next(new HttpError("could not find a place", 404));
  }
  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "somthing went wrong could not save place",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const DeletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError("somthing went wrong", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("could not find place for this id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "somthing went wrong could not remove place",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "deleted place" });
};

exports.getPlaceById = getPlaceById;
exports.getplacesByUserId = getplacesByUserId;
exports.createPlace = createPlace;
exports.UpdatePlaceById = UpdatePlaceById;
exports.DeletePlaceById = DeletePlaceById;
