const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: String,
    username: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "That username is taken"]
    },
    password: {
      type: String,
      required: true,
      select: false // hide in response
    },
    isAdmin: {
      type: Boolean,
      select: false,
      default: false
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
  return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

const User = mongoose.model("User", userSchema, "users");

module.exports = { User, userSchema };
