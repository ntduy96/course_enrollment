var mysql = require('mysql');

//create connection to mysql database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'nlproject',
  password: 'nlproject',
  database: 'simpleapp'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

connection.query('SET NAMES \'utf8\'');

module.exports = connection;