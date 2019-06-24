const bcrypt = require("bcrypt");
const { User, validateUserInput } = require("../models/users");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

// Get All Users
router.get("/", async (req, res) => {
  const user = await User.find().sort("name");
  if (!user) return res.status(404).send("No Registered Users");
  res.send(user);
});

// POST create new User
router.post("/", async (req, res) => {
  // Validation Input
  const resultValidation = validateUserInput(req.body);
  if (resultValidation.error) {
    return res.status(400).send(resultValidation.error.details[0].message);
  }

  //  Find User if Existing
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email Already Registered");

  // Create User
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.send(_.pick(user, ["_id", "name", "email"]));
});

// PUT to update User
router.put("/:id", async (req, res) => {
  // Validation Input
  const resultValidation = validateUserInput(req.body);
  if (resultValidation.error) {
    return res.status(400).send(resultValidation.error.details[0].message);
  }

  // Find and Update
  const user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  if (!user) return res.status(404).send("User not Found");
  res.send(user);
});

// Delete User
router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send("Delete: No User Found");
  res.send(user);
});

// Get user id
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("Cant Find the User ID");
  res.send(user);
});

module.exports = router;
