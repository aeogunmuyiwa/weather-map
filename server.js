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








app.get('/', function (req, res) {
  // NEW CODE
  return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));;
})
app.post('/', function (req, res, next)
 {
  // confirm that user typed same password twice
   if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/weather');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/weather');
      }
    });
  }
})

app.get('/weather', function (req, res) {
  // NEW CODE
  res.render('weather', {weather: null, error: null});
})
app.post('/weather', function (req, res) {
    let city = req.body.city;
    let country = req.body.country;
    //let url http://api.wunderground.com/api/81c4822662060f99/conditions/q/CA/San_Francisco.json

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=imperial&appid=${apiKey}`

    request(url, function (err, response, body) {
    if(err){
      res.render('weather', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('weather', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${city},${country}!`;
        res.render('weather', {weather: weatherText, error: null});
      }
    }
  });




})
app.get('/index1', function (req, res) {
  // NEW CODE
  res.render('index1');
})
app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/index1');
  })


app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})





