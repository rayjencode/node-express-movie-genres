const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/users");
const express = require("express");
const router = express.Router();
const config = require("config");

// POST authentication
router.post("/", async (req, res) => {
  // Validation input
  const resultValidation = validateAuthInput(req.body);
  if (resultValidation.error) {
    return res.status(400).send(resultValidation.error.details[0].message);
  }

  // Find the User
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  // password compare user password - user inpout
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalida email or password");

  // generate JSON web token
  const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));

  res.send(token);
});

function validateAuthInput(req) {
  const schema = {
    email: Joi.string()
      .min(3)
      .email()
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;
