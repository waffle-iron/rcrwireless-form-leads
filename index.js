if (['test', 'production'].indexOf(process.env.NODE_ENV) === -1) {
  require('dotenv').config();
}

const passport = require('./config/passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express')
const app = express();
const mongoose = require('mongoose');
mongoose.connection.openUri(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
const User = require('./models/User');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false
}));

app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(cookieParser());
app.use(csrf({cookie: true}));
if (process.env.NODE_ENV != 'production') app.use(require('morgan')('dev'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('express-ejs-extend'));

app.use('/api', require('./routes/api'));
app.use('/', require('./routes/index'));

app.listen(process.env.PORT, () => {
  console.log(`Hosting on http://127.0.0.1:${process.env.PORT}`)
})

module.exports = app;
