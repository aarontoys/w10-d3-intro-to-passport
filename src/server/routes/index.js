var express = require('express');
var router = express.Router();
var passport = require('../lib/auth');
var knex = require('../db/knex');
var helpers = require('../lib/helpers');
var bcrypt = require('bcrypt');

function Users() {
  return knex('users');
}

router.get('/', helpers.ensureAuthenticated, function (req, res, next) {
  console.log(req.user);
  res.render('index', { title: 'Welcome to passport app', user: req.user });
});

router.get('/login', helpers.loginRedirect, function (req, res, next) {
  // console.log('flash: ', req.flash());
  res.render('login', { title: 'Please Login', message: req.flash('message')});
});

router.post('/login', function (req, res, next) {
  // console.log(email);
  // console.log(pass);
  // res.json({email: email, password: pass});
  passport.authenticate('local', function (err, user) {
    if (err) {
      console.log('line24')
      return next(err);
    } else {
      console.log('line27')
      console.log('line 28 ',user);
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      })
    }
  }) (req, res, next);
});

router.get('/logout', helpers.ensureAuthenticated, function (req, res, next) {
  req.logout(); 
  res.redirect('/');
})

router.get('/register', helpers.loginRedirect, function (req, res, next) {
  res.render('register', { title: 'Please register for our app'});
});

router.post('/register', function (req, res, next) {
  email = req.body.email;
  pass = req.body.password;
  console.log(email);
  //check if email is is unique - knex
  Users().where('email',email)
    .then(function (result) {
      if (result.length) {
        res.render('register', { error: 'The email address is already used'})
      }
      else {
        var hashedPW = helpers.hashing(pass);

        // console.log('result: ', result);
        Users().insert({'email': email, 'password': hashedPW}, 'id')
        .then(function (data) {
          req.flash('message', {
            status: 'success',
            message: 'Flash data success'
          });
          return res.redirect('/login');
        })
        .catch(function (err) {
          return res.send('crap');
        });
      }
    })
    .catch(function (err) {
      return next(err);
    })
    //if email is in the datababe - tell user
    //else add user - insert with knex

  // res.json({email: email, password: pass});
});

// router.get('/login-success', function (req, res, next) {
//   res.render('login-success', { title: 'hell yeah!'});
// });

// router.get('/login-failure', function (req, res, next) {
//   res.render('login-failure', { title: 'oh shit!'});
// });

module.exports = router;
