const mongoose = require("mongoose");
const Joi = require("joi");

// Genre Schema Model
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 25
  }
});

const Genre = mongoose.model("Genre", genreSchema);

// Validation Input
validateGenresInput = genres => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(genres, schema);
};

module.exports = {
  Genre,
  genreSchema,
  validateGenresInput
};
