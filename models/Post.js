const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 70
  },
  content: {
    type: String,
    required: true,
    maxlength: 300
  },
  author: { type: Schema.Types.ObjectId, ref: "User" }
});

const Post = mongoose.model("Post", postSchema, "posts");

module.exports = { Post, postSchema };
