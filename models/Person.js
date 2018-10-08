const mongoose = require("mongoose");

const personSchema = {
  firstName: String,
  lastName: String,
  email: String
};

const Person = mongoose.model("Person", personSchema, "people");

module.exports = { Person, personSchema };
