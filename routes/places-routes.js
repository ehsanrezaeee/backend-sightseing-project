const express = require("express");

const router = express.Router();

const placeController = require("../controllers/places-controller");

router.get("/:pid", placeController.getPlaceById);

router.get("/user/:uid", placeController.getplaceByUserId);

module.exports = router;
