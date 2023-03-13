const express = require("express");

const router = express.Router();

const userController = require("../controllers/users-controller");

router.get("/", userController.getAllUsers);

router.post("/signup", userController.registerUsers);

router.post("/login", userController.loginUsers);

module.exports = router;
