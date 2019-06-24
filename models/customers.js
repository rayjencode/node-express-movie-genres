const mongoose = require("mongoose");
const Joi = require("Joi");

// Customer Schema Model
const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25
    },
    isGold: {
      type: Boolean,
      default: true
    },
    phone: {
      type: String,
      required: true
    }
  })
);

validateCustomerInput = customer => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
    phone: Joi.string()
      .min(5)
      .required(),
    isGold: Joi.boolean()
  };
  return Joi.validate(customer, schema);
};

module.exports = {
  Customer,
  validateCustomerInput
};
