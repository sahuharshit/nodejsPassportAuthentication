module.exports = {
  ensureAuthenticated: function(req, res, next) {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Login To Continue');
    console.log('I am sorry, Login Failed');
    res.redirect('/fdas');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/protected-route');      
  }
};
