const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const imageMiddleware = require("../middlewares/imageMinddleware");

router.get("/", homeController.index);
router.get("/user/login", userController.login);

router.get("/post/add", postController.add);
router.post(
  "/post/add",
  imageMiddleware.upload,
  imageMiddleware.resize,
  postController.addAction,
);

router.get("/post/:slug/edit", postController.edit);
router.post(
  "/post/:slug/edit",
  imageMiddleware.upload,
  imageMiddleware.resize,
  postController.editAction,
);

router.get("/post/:slug", postController.view);

module.exports = router;
