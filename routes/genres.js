const { Genre, validateGenresInput } = require("../models/genres");
const express = require("express");
const router = express.Router();

// GET All Genres
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

// POST Create New Genre
router.post("/", async (req, res) => {
  // Validation Input
  const resultValidation = validateGenresInput(req.body);
  if (resultValidation.error) {
    return res.status(400).send(resultValidation.error.details[0].message);
  }
  //   Create Genre
  let genre = new Genre({ name: req.body.name });
  await genre.save();
  res.send(genre);
});

// PUT Genre
router.put("/:id", async (req, res) => {
  // Validation Input
  const resultValidation = validateGenresInput(req.body);
  if (resultValidation.error) {
    return res.status(400).send(resultValidation.error.details[0].message);
  }

  //   Find and update
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) return res.status(404).send("Update: No Item Found");
  //    Return to Client
  res.send(genre);
});

// Delete Genre by ID
router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id, {
    name: req.body.name
  });
  if (!genre) return res.status(404).send("Delete: Item Not Found");
  res.send(genre);
});

// GET Genre by ID
router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Fetching: Item Not Found");
  res.send(genre);
});

module.exports = router;
