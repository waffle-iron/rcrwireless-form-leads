module.exports = {
  isAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) return next();
    return res.redirect('/');
  },
  isUser: (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.redirect('/');
  }
}
