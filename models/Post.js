const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: [300, "Content cannot be more than 300 characters"]
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    location: String,
    imageURL: String
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model("Post", postSchema, "posts");

module.exports = { Post, postSchema };
