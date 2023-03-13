const { uuid } = require("uuidv4");

const HttpError = require("../models/error-model");

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

const getAllUsers = (req, res, next) => {
  res.json({ users: Dummy_Users });
};

const registerUsers = (req, res, next) => {
  const { email, name, password } = req.body;

  const hasUser = Dummy_Users.find((p) => {
    p.email === email;
  });
  if (hasUser) {
    throw new HttpError("user already signed up!", 422);
  }
  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  Dummy_Users.push(createdUser);

  res.json({ user: createdUser });
};

const loginUsers = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = Dummy_Users.find((p) => {
    return p.email === email;
  });
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("no user found with this wrong credentials!", 401);
  }
  res.json("Logged in!");
};

exports.getAllUsers = getAllUsers;
exports.registerUsers = registerUsers;
exports.loginUsers = loginUsers;
