const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', (req, res, next) => {
  if(!req.isAuthenticated()){
    res.redirect('/login');
  } else {
    res.render('index', {
      user: req.user,
      csrfToken: req.csrfToken()
    });
  }
});

router.get('/login', (req, res, next) => {
  if(req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login', {
      csrfToken: req.csrfToken()
    });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/register', (req, res, next) => {
  if(req.isAuthenticated()) {
    return res.redirect('/');
  } else {
    return res.render('register', {
      csrfToken: req.csrfToken()
    });
  }
});

router.post('/login', passport.authenticate( 'local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.post('/register', (req, res) => {
  if (req.body.password.length < 6) throw 'Password must be at least 6 characters.';
  bcrypt.hash(req.body.password, saltRounds)
  .then(hash => {
    const username = req.body.username.toLowerCase();
    const user = new User({
      username,
      password: hash
    });
    return user.save();
  })
  .then(user => {
    return res.redirect('/');
  })
  .catch(error => {
    req.flash('error', error);
    return res.redirect('/register');
  });
});

module.exports = router;
