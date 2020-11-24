const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json();
const app = express();
const port = 3000;
const saltvalue = 10;
const db_con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'expressapidb',
  multipleStatements: true,
});
db_con.connect(function (err) {
  if (err) throw err;
  console.log('Database Connected');
});

//
app.post('/register', urlencodedParser, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  bcrypt.hash(password, 10, function (err, hash) {
    db_con.query(
      'INSERT INTO registrationtable(username,password) VALUES(?,?)',
      [username, hash],
      (err, result) => {
        if (err) console.log(err);
      }
    );
  });
  res.send('registration finished');
});
app.post('/login', urlencodedParser, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  db_con.query('SELECT * FROM registrationtable WHERE username=?', [username], (err, result) => {
    console.log(result);
    if (err) {
      res.send({ err: err });
    } else {
      console.log('success');
      console.log(result);
      for (let data of result) {
        result = data;
      }
      console.log(result.password, 'res');
      console.log(req.body.password, 'req');
      bcrypt.compare(req.body.password, result.password, (err, resp) => {
        console.log(resp);
        if (resp === true) {
          res.send('logged in');
        } else {
          res.send('Wrong Username/password');
        }
      });
    }
  });

  //  res.send('login finished');
});

app.listen(port, () => console.log('server is running'));
