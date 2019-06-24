const { Customer, validateCustomerInput } = require("../models/customers");
const express = require("express");
const router = express.Router();

// Get all Customers
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

// POST New Customers
router.post("/", async (req, res) => {
  // Validation
  const resultValidation = validateCustomerInput(req.body);
  if (resultValidation.error) {
    return res.status(400).send(resultValidation.error.details[0].message);
  }
  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  await customer.save();
  res.send(customer);
});

// PUT to update customer
router.put("/:id", async (req, res) => {
  // Validation
  const resultValidation = validateCustomerInput(req.body);
  if (resultValidation.error) {
    return res.status(400).send(resultValidation.error.details[0].message);
  }

  // Find and update
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { phone: req.body.phone }
  );

  if (!customer) return res.status(404).send("Update: Customer not Found");
  res.send(customer);
});

// Delete Customer
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send("Delete: Customer not Found");
  res.send(customer);
});

// Get customer by ID
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("Fetch: Customer Not Found");
  res.send(customer);
});

module.exports = router;
