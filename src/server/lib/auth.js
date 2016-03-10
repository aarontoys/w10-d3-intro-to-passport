var passport = require('passport');
var LocalStrategy = require('passport-local');
var knex = require('../db/knex');
var helpers = require('./helpers')
function Users() {
  return knex('users');
}

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    console.log('line12: ',email);
      //does user exist? - usedknex
    Users().where('email',email)
      .then(function (result) {
        //email does not exist - return error
        if (!result.length) {
          return done(null, 'Line 19 Incorrect Email')
        }
        var user = result[0];
        //user existis - check passord
        console.log('line 23: ', user);
        console.log('comparePW: ', helpers.comparePW(password, user.password));
        if ( helpers.comparePW(password, user.password) ) {
        // if (password === user.password) {
          console.log('user: ', user);
          //passwords match - return user
          return done(null, user);
        }
        else {
          //passords don't match
          return done('Line 33 Incorrect password');
        }
        })
      .catch(function (err) {
        //issue with SQL/knex query;
        return done('Database issue!')
      });
  }
));

// sets the user to 'req.user' and establishes a session via a cookie
passport.serializeUser(function(user, done) {
  console.log('user:',  user);
  done(null, user.id);
});

// used on subsequent requests to update 'req.user' and updates session
passport.deserializeUser(function(id, done) {
  knex('users').where('id', id)
  .then(function(data) {
    return done(null, data[0]);
  })
  .catch(function(err) {
    return done(err);
  });
});


module.exports = passport;