var application_root = __dirname,
  express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
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
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.redirect('/user');
  }
});

//show login page
app.get('/login', function(req, res) {
  if (!req.session.user) {
    // authenticate failed
    if (req.query.status === 'failed') {
      var message = 'Username or password is wrong, please try again!!:(';
    }

    // signed up successfully but need to log in
    if (req.query.status === 'success' && req.query.action === 'signup') {
      var message = 'You signed up successfully, please log in :)';
    }

    res.render('login', { 'message': message });
  } else {
    res.redirect('/user');
  }
});

//process data from login form submission
app.post('/login', function(req, res) {
  connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [req.body.username, req.body.password], function(err, results) {
    if (results.length === 1) {
      // user loged in successfully :)
      req.session.user = {
        username: results[0].username,
        fname: results[0].fname,
        lname: results[0].lname,
        email: results[0].email
      }
      res.redirect('/user');
    } else {
      //Username or password is wrong, please try again!!:(
      res.redirect('/login?status=failed');
    }
  });
});

// show sign up page
app.get('/signup', function(req, res) {
  if (!req.session.user) {
    if (req.query.status === 'failed') {
      var message = 'Username or email is already used, please try another username or email!!:(';
    }
    res.render('signup', { 'message': message });
  } else {
    res.redirect('/user');
  }
});
// handle data form sign up
app.post('/signup', function(req, res) {
  var user = {
    username: req.body.username,
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password
  };

  connection.query('INSERT INTO user SET ?', user, function(err, results) {
    if (err) {
      // Username or email is already used
      res.redirect('/signup?status=failed');
    } else {
      // user registered successfully :)
      res.redirect('/login?status=success&action=signup');
    }
  });
});

// log out request handler
app.post('/logout', function(req, res) {
  if (!req.session.user) {
    res.cookie('message', 'Please log in first!!:)', { path: '/login', maxAge: 3000 });
    res.redirect('/login');
  } else {
    req.session.destroy();
    res.redirect('/login');
  }
});

// show user page
app.get('/user', function(req, res) {
  if (req.session.user) {
    // connection.query('SELECT * FROM course', function(err, results) {
    //   var courses = results;
    //   console.log(courses);
    //   var queryStr = 'SELECT DISTINCT c.course_id, c.course_name, c.course_desc FROM enroll e INNER JOIN user u ON u.username = e.user INNER JOIN course c ON c.course_id = e.course WHERE u.username = ? ORDER BY c.course_id';
    //   connection.query(queryStr, [req.session.user.username], function(err, results) {
    //     console.log(results);
    //     var enrolls = results || [];
    //     res.render('user', {
    //       message: 'Welcome ' + req.session.user.fname + ' ' + req.session.user.lname,
    //       courses: courses,
    //       enrolls: enrolls
    //     });
    //   });

    // });

    connection.query('SELECT * FROM course; SELECT DISTINCT c.course_id, c.course_name, c.course_desc FROM enroll e INNER JOIN user u ON u.username = e.user INNER JOIN course c ON c.course_id = e.course WHERE u.username = ? ORDER BY c.course_id', [req.session.user.username], function(err, results) {
      res.render('user', {
        message: 'Welcome ' + req.session.user.fname + ' ' + req.session.user.lname,
        courses: results[0], // results for the first statement
        enrolls: results[1] // results for the second statement
      });
    });

  } else {
    res.redirect('/login');
  }

});

app.listen(3000, function() {
  console.log('server is running on port 3000');
});