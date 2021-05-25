const mongoose = require("mongoose");
const Post = mongoose.model("Post");

exports.index = async (req, res) => {
  let responseJSON = {
    nome: "Ivanildo",
    idade: 33,
    pageTitle: "Página Inicial",
  };
  const posts = await Post.find();
  responseJSON.posts = posts;
  res.render("home", responseJSON);
};
