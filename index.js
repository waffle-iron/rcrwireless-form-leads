const passport = require('./config/passport');
const LocalStrategy = require('passport-local').Strategy;
const app = require('express')();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quickvr');
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
  secret: 'foo',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(cookieParser());
app.use(csrf({cookie: true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', require('./routes/index'));

app.listen(3000, () => {
  console.log('Hosting on http://127.0.0.1:3000')
})

module.exports = app;
