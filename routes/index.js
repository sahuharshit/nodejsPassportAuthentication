const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/authRestriction');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/protected-route', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;
