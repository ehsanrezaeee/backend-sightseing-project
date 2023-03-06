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

exports.getPlaceById = getPlaceById;
exports.getplaceByUserId = getplaceByUserId;
