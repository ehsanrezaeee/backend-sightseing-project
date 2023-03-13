const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const placeController = require("../controllers/places-controller");

router.get("/:pid", placeController.getPlaceById);

router.get("/user/:uid", placeController.getplacesByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placeController.createPlace
);

router.patch("/:pid", placeController.UpdatePlaceById);

router.delete("/:pid", placeController.DeletePlaceById);

module.exports = router;
