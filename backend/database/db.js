const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/Astro");
mongoose.connect(
  "mongodb+srv://omd184:myCluster@mycluster.kmtaetd.mongodb.net/astro"
);

let userSchema = mongoose.Schema({
  isAdmin: Boolean,
  name: String,
  username: String,
  password: String,
});

let blogSchema = mongoose.Schema({
  isApproved: Boolean,
  name: String,
  title: String,
  blog: String,
  date: String,
  time: String,
});

const User = mongoose.model("User", userSchema);
const Blog = mongoose.model("blog", blogSchema);

module.exports = { User, Blog };
