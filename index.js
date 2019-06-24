const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const genres = require("./routes/genres");
const customers = require("./routes/customer");
const rentals = require("./routes/rentals");
const movies = require("./routes/movies");
const users = require("./routes/users");
const auth = require("./routes/auth");
const config = require("config");

// Config Private Key if not defined
if (!config.jwtPrivateKey) {
  console.error("FATAL ERROR: jwtPrivateKey is not yet defined");
  process.exit(1);
}

// Initialize Database Connection
mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to mongoDB"));

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load Router
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
