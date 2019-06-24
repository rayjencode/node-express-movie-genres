const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Rental, validateRentalInput } = require("../models/rentals");
const { Movie } = require("../models/movies");
const { Customer } = require("../models/customers");
const Fawn = require("fawn");

Fawn.init(mongoose);

// Get All Rentals
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("--dateOut");
  res.send(rentals);
});

// POST new Rentals
router.post("/", async (req, res) => {
  // Validation input
  const resultValidation = validateRentalInput(req.body);
  if (resultValidation.error) {
    return res.status(404).send(resultValidation.error.details[0].message);
  }

  // Find Customer by ID
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid Customer");

  // Find Movie by ID
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Movie not Found");

  // Check if movie is in stock
  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in Stock");

  // Create new Rental Object
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("Fetch: Not Found");
  res.send(rental);
});

module.exports = router;
