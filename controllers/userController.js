const User = require("../models/User");
exports.login = (req, res) => {
  res.render("login");
};

exports.loginAction = (req, res) => {
  const { email, password } = req.body;
  const auth = User.authenticate();
  auth(email, password, (error, result) => {
    if (!result) {
      req.flash("error", "Seu e-mail e/ou senha estão incorretos!");
      res.redirect("/users/login");
      return;
    }
    req.login(result, () => {});
    req.flash("success", "Você foi logado com sucesso");
    res.redirect("/");
  });
};

exports.register = (req, res) => {
  res.render("register");
};

exports.registerAction = (req, res) => {
  const newUser = new User(req.body);
  User.register(newUser, req.body.password, (error) => {
    if (error) {
      req.flash("error", "Ocorreu um erro, tente mais tarde.");
      res.redirect("/users/register");
      return;
    }
    req.flash("success", "Registro efetuado com sucesso. Faça o login");
    res.redirect("/users/login");
  });
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};

exports.profile = (req, res) => {
  res.render("profile");
};

exports.profileAction = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { name, email },
      { new: true, runValidators: true },
    );
  } catch (error) {
    req.flash("error", "Ocorreu algum erro na atualização");
    res.redirect("/profile");
    return;
  }
  req.flash("success", "Dados Atualizados com sucesso");
  res.redirect("/profile");
};
