const express = require("express");

const router = express.Router();

const placeController = require("../controllers/places-controller");

router.get("/:pid", placeController.getPlaceById);

router.get("/user/:uid", placeController.getplaceByUserId);

router.post("/", placeController.createPlace);

router.patch("/:pid", placeController.UpdatePlaceById);

router.delete("/:pid", placeController.DeletePlaceById);

module.exports = router;
