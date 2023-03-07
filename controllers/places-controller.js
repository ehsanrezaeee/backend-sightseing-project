const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/error-model");

Dummy_Places = [
  {
    id: "p1",
    title: "Milad Tower",
    description: "Tallest building in Iran",
    imageUrl: "https://tasteiran.net/Files/milad-tower-tehran-9ed0a9.jpg",
    address: "Tehran, Tehran Province",
    location: {
      lat: 35.7448416,
      lng: 51.3731325,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Milad Tower",
    description: "Tallest building in Iran",
    imageUrl: "https://tasteiran.net/Files/milad-tower-tehran-9ed0a9.jpg",
    address: "Tehran, Tehran Province",
    location: {
      lat: 35.7448416,
      lng: 51.3731325,
    },
    creator: "u2",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = Dummy_Places.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError("could not find a place", 404);
  }
  res.json({ place });
};

const getplaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = Dummy_Places.find((p) => {
    return p.creator === userId;
  });
  if (!place) {
    return next(new HttpError("could not find a place", 404));
  }
  res.json({ place: place });
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  Dummy_Places.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const UpdatePlaceById = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;
  const updatedPlace = { ...Dummy_Places.find((p) => p.id === placeId) };
  const placeIndex = Dummy_Places.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  Dummy_Places[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const DeletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  Dummy_Places = Dummy_Places.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "deleted place" });
};

exports.getPlaceById = getPlaceById;
exports.getplaceByUserId = getplaceByUserId;
exports.createPlace = createPlace;
exports.UpdatePlaceById = UpdatePlaceById;
exports.DeletePlaceById = DeletePlaceById;
