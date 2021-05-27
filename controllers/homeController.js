const mongoose = require("mongoose");
const Post = mongoose.model("Post");

exports.index = async (req, res) => {
  let responseJSON = {
    nome: "Ivanildo",
    idade: 33,
    pageTitle: "Página Inicial",
    tags: [],
    tag: "",
  };
  responseJSON.tag = req.query.t;
  const postFilter =
    typeof responseJSON.tag !== "undefined" ? { tags: responseJSON.tag } : {};

  const tagsPromisse = Post.getTagsList();
  const postsPromisse = Post.findPosts(postFilter);

  const [tags, posts] = await Promise.all([tagsPromisse, postsPromisse]);

  for (let i in tags) {
    if (tags[i]._id === responseJSON.tag) {
      tags[i].class = "selected";
    }
  }

  responseJSON.posts = posts;
  responseJSON.tags = tags;

  res.render("home", responseJSON);
};
