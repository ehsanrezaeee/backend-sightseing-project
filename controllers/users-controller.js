const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/error-model");
const User = require("../models/user");

Dummy_Users = [
  {
    id: "p1",
    name: "esi1",
    email: "test@test.com",
    password: "esi123",
  },
  {
    id: "p2",
    name: "esi2",
    email: "test2@test.com",
    password: "esi123",
  },
];

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("fetching users failed", 500);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const registerUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid data", 422));
  }
  const { email, name, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("sign up failed, try again.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("user already exist, please login", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://www.collinsdictionary.com/images/thumb/apple_158989157_250.jpg?version=4.0.302",
    places: [],
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("creating user failed fuck, try again", 500);
    return next(error);
  }

  res.json({ user: createdUser.toObject({ getters: true }) });
};

const loginUsers = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("logging in failed, try again.", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("invalid credentials", 401);
    return next(error);
  }

  res.json({
    message: "Logged in!",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getAllUsers = getAllUsers;
exports.registerUsers = registerUsers;
exports.loginUsers = loginUsers;
