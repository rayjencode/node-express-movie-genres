const mongoose = require("mongoose");
const express = require("express");
const { Movie, validateMovieInput } = require("../models/movies");
const { Genre } = require("../models/genres");
const router = express.Router();

// Get all Movies
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  if (!movies) return res.status(404).send("Fetch: No Movie Found");
  res.send(movies);
});

// POST new movie
router.post("/", async (req, res) => {
  // Validation Input
  const resultValidation = validateMovieInput(req.body);
  if (resultValidation.error) {
    return res.status(400).send(resultValidation.error.details[0].message);
  }
  // Find Genre
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(40).send("Invalid Genre");

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  await movie.save();
  res.send(movie);
});

// PUT to update movie
router.put("/:id", async (req, res) => {
  // Validation Input
  const resultValidation = validateMovieInput(req.body);
  if (resultValidation.error) {
    return res.status(400).send(resultValidation.error.details[0].message);
  }

  // Find and Update
  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  if (!movie) return res.status(404).send("Failed to update: Movie not found");
  res.send(movie);
});

// Delete Movie
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send("Unable to Delete: Movie not found");
  res.send(movie);
});

// Get Movie by ID
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Fetch: Movie not Found");
  res.send(movie);
});

module.exports = router;
