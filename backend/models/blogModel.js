const mongoose = require("mongoose");
let blogSchema = mongoose.Schema({
  isApproved: Boolean,
  name: String,
  title: String,
  blog: String,
  date: String,
  time: String,
  userId: String,
  message: String,
});
const Blog = mongoose.model("blog", blogSchema);

module.exports = { Blog };
