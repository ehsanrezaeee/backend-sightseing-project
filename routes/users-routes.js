const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const userController = require("../controllers/users-controller");

router.get("/", userController.getAllUsers);

router.post(
  "/signup",
  [
    check("email").normalizeEmail().isEmail(),
    check("name").not().isEmpty(),
    check("password").isLength({ min: 6 }),
  ],
  userController.registerUsers
);

router.post("/login", userController.loginUsers);

module.exports = router;
