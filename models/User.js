const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    username: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false, // hide in response
      unique: true
    }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

userSchema.virtual("fullName").get(function() {
  return this.firstName + " " + this.lastName;
});

const User = mongoose.model("User", userSchema, "users");

module.exports = { User, userSchema };
