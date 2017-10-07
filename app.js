var application_root = __dirname,
  express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  uniqid = require('uniqid'),
  ejs = require('ejs');

//initialize an express server
var app = express();

//set view engine for render
app.set('view engine', 'ejs');

//Cấu hình liên quan đến express.js
app.use(express.static(path.join(application_root, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(errorHandler({ dumpExceptions: true, showStack: true }));
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

//import connection to mysql
var connection = require('./connection');

app.get('/', function(req, res) {
  // req.session.username = 'ntduy96';
  if (!req.session.username) {
    res.redirect('/login');
  } else {
    res.redirect('/user');
  }
});

//show login page
app.get('/login', function(req, res) {
  // res.sendFile(path.join(application_root, 'public', 'login.html'));
  if (!req.cookies.username) {
    res.render('login', { message: req.cookies.message });
  } else {
    res.redirect('/user');
  }
});

//process data from login form submission
app.post('/login', function(req, res) {
  connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [req.body.username, req.body.password], function(err, results) {
    if (results.length === 1) {
      // user loged in successfully :)
      var options = {
        path: '/',
        maxAge: 1000 * 60 * 15 // would expire after 15 minutes
      }
      res.cookie('username', req.body.username, options);
      res.cookie('fname', results[0].fname, options);
      res.cookie('lname', results[0].lname, options);
      // req.cookies.username = req.body.username; //username will be stored in session
      res.redirect('/user');
    } else {
      //Username or password is wrong, please try again!!:(
      res.cookie('message', 'Username or password is wrong, please try again!!:(', { path: '/login', maxAge: 3000 });
      res.redirect('/login');
    }
  });
});
// show sign up page
app.get('/signup', function(req, res) {
  // res.sendFile(path.join(application_root, 'public', 'signup.html'));
  if (!req.cookies.username) {
    res.render('signup', { message: req.cookies.message });
  } else {
    res.redirect('/user');
  }
});
// handle data form sign up
app.post('/signup', function(req, res) {
  var user = {
    id: uniqid(),
    username: req.body.username,
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password
  };

  connection.query('INSERT INTO user SET ?', user, function(err, results) {
    if (err) {
      //Username or email is already used, please try another username or email!!:(
      res.cookie('message', 'Username or email is already used, please try another username or email!!:(', { path: '/signup', maxAge: 3000 });
      res.redirect('/signup');
    } else {
      //user registered successfully :)
      res.cookie('message', 'Your account was created, please log in!!:)', { path: '/login', maxAge: 3000 });
      res.redirect('/login');
    }
  });
});

// log out request handler
app.post('/logout', function(req, res) {
  if (!req.cookies.username) {
    res.cookie('message', 'Please log in first!!:)', { path: '/login', maxAge: 3000 });
    res.redirect('/login');
  } else {
    res.clearCookie('username', { path: '/' });
    res.redirect('/login');
  }
});

// show user page
app.get('/user', function(req, res) {
  if (req.cookies.username) {
    connection.query('SELECT * FROM course', function(err, results) {
      var courses = results;
      var queryStr = 'SELECT DISTINCT c.* FROM enroll e INNER JOIN user u ON u.id = e.student INNER JOIN course c ON c.id = e.course WHERE u.username = ? ORDER BY c.id';
      connection.query(queryStr, [req.cookies.username], function(err, results) {
        var enrolls = results;
        res.render('user', {
          message: 'Welcome ' + req.cookies.fname + ' ' + req.cookies.lname,
          courses: courses,
          enrolls: enrolls
        });
      });

    });

  } else {
    res.cookie('message', 'Please log in first!!:)', { path: '/login', maxAge: 3000 });
    res.redirect('/login');
  }

});

app.listen(3000, function() {
  console.log('server is running on port 3000');
});