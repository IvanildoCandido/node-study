exports.isLogged = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Ops! Você não tem permissão de acessar esta página.");
    res.redirect("/users/login");
    return;
  }
  next();
};

exports.changePassword = (req, res) => {
  const { password, passwordConfirm } = req.body;
  if (password !== passwordConfirm) {
    req.flash("error", "Senhas não conferem!");
    return res.redirect("/profile");
  }
  req.user.setPassword(password, async () => {
    await req.user.save();
    req.flash("success", "Senha alterada com sucesso!");
    res.redirect("/");
  });
};
