const Joi = require("joi");
const mongoose = require("mongoose");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50
        },
        isGold: {
          type: Boolean,
          default: false
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50
        }
      }),
      required: true
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 25
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 25
        }
      }),
      require: true,
      dateOut: {
        type: Date,
        required: true,
        default: Date.now
      },
      dateReturned: {
        type: Date
      },
      rentalFee: {
        type: Number,
        min: 0
      }
    }
  })
);

function validateRentalInput(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}

module.exports = {
  Rental,
  validateRentalInput
};
