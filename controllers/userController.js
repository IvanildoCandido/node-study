const User = require("../models/User");
const crypto = require("crypto");
const mailHandler = require("../handlers/mailHandler");
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

exports.forget = (req, res) => {
  res.render("forget");
};

exports.forgetAction = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).exec();
  if (!user) {
    req.flash("error", "E-mail não cadastrado.");
    return res.redirect("/users/forget");
  }

  user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const resetLink = `http://${req.headers.host}/users/reset/${user.resetPasswordToken}`;
  const to = `${user.name} <${user.email}>`;
  const html = `Testando o email com o link:<br/> 
  <a href="${resetLink}">Resetar sua senha</a>`;
  const text = `Testando o email com o link: ${resetLink}`;

  mailHandler.send({
    to,
    subject: "Resetar sua senha.",
    html,
    text,
  });

  req.flash(
    "success",
    "Foi enviado um e-mail com as instruções para redefinir sua senha.",
  );
  res.redirect("/users/login");
};

exports.forgetToken = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  }).exec();

  if (!user) {
    req.flash("error", "Token expirado!");
    return res.redirect("/users/forget");
  }
  res.render("forgetPassword");
};

exports.forgetTokenAction = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  }).exec();

  if (!user) {
    req.flash("error", "Token expirado!");
    return res.redirect("/users/forget");
  }

  const { password, passwordConfirm } = req.body;
  if (password !== passwordConfirm) {
    req.flash("error", "Senhas não conferem!");
    return res.redirect("back");
  }
  user.setPassword(password, async () => {
    await user.save();
    req.flash("success", "Senha alterada com sucesso!");
    res.redirect("/");
  });
};
