const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: [70, "Title cannot be more than 70 characters"]
    },
    content: {
      type: String,
      required: true,
      maxlength: [300, "Content cannot be more than 300 characters"]
    },
    author: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model("Post", postSchema, "posts");

module.exports = { Post, postSchema };
