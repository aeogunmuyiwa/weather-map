const express = require('express')
const app = express()
var router = express.Router();
const bodyParser = require('body-parser');
const request = require('request');
//const apiKey = 'ef125c41bb79578e91dd5f430a31a577';
//app.use(express.static('public'));
app.use(express.static(__dirname + '/templateLogReg'));
// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
var apiKey = '16ee4625714e49bcab012054182103';

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var morgan       = require('morgan');
var configDB = require('./config/database.js');
var MongoStore = require('connect-mongo')(session);
mongoose.connect('mongodb://localhost/testForAuth');
var db = mongoose.connection;
var User = require('./app/models/user');

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// configuration ===============================================================
//// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

require('./config/passport')(passport);
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session







app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})





