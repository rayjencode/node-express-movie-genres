const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genres");

// Schema Movies Model
const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 25
    },
    genre: {
      type: genreSchema,
      required: true
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 25
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 25
    }
  })
);

function validateMovieInput(movie) {
  const schema = {
    title: Joi.string()
      .min(3)
      .max(25)
      .required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(3)
      .max(25)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(25)
      .required()
  };
  return Joi.validate(movie, schema);
}

module.exports = {
  Movie,
  validateMovieInput
};
