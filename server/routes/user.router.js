var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

// Handles Ajax request for user information if user is authenticated
router.get('/', function (req, res) {
  console.log('get /user route');
  // check if logged in
  if (req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in', req.user);
    var userInfo = {
      username: req.user.username
    };
    res.send(userInfo);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

//GET request for supervisors
router.get('/supervisors', function (req, res) {
  if (req.isAuthenticated()) {
    pool.connect(function(err, db, done) {
      if (err) {
        console.log('error connecting', err);
        res.sendStatus(500);
      }
      var queryText = 'SELECT * FROM "users" WHERE "role" = $1;';
        db.query(queryText, ['supervisor'], function (err, result) {
          db.end();
          if (err) {
            console.log("Error inserting data: ", err);
            res.sendStatus(500);
          } else {
            res.send(result.rows);
          }
        });
    })
  }
})

// clear all server session information about this user
router.get('/logout', function (req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});


module.exports = router;
