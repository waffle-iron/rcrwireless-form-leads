const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

passport.use(new LocalStrategy((username, password, done) => {
  let userMatch;
  User.findOne({ username : username.toLowerCase() })
  .then(user => {
    if (!user) throw { message: 'Incorrect username.' };
    userMatch = user;
    return bcrypt.compare(password, user.password)
  })
  .then(match => {
    if (!match) throw { message: 'Incorrect password.' };
    return done(null, userMatch);
  })
  .catch(error => {
    return done(null, false, error);
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
  .then(user => {
    done(null, user);
  })
  .catch(error => {
    return done(null, false, error);
  });
});

module.exports = passport;
