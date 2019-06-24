const mongoose = require("mongoose");
const Joi = require("joi");

// User Schema Model
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255
    }
  })
);

function validateUserInput(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
    email: Joi.string()
      .min(3)
      .required()
      .email()
      .min(5)
      .max(255),
    password: Joi.string()
      .min(6)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports = {
  User,
  validateUserInput
};
