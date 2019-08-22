module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated) {
      return next();
    };
    req.flash('errormsg', 'You do not have permissions to view this page.');
    res.redirect('/');
  }
};
