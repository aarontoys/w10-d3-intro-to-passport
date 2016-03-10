var bcrypt = require('bcrypt');

function ensureAuthenticated (req, res, next) {
         
  //checking if user is authenicated
  if (req.user) {
    //if so -> call next()
    return next();
  } else {
    //if not -> redirect to login
    return res.redirect('/login');
  }
}

function loginRedirect (req, res, next) {
  //check if user is authenicated
  if (req.user) {
    return res.redirect('/');
  } else {
    return next();
  }
}

function hashing (password) {
  return bcrypt.hashSync(password, 10);

  //Need to add promises
  // var hashPW;
  // bcrypt.hash(password, 10, function (err, hash) {
  //   if (err) {
  //     return 'something bad happened';
  //   } else {
  //   hashPW = hash;
  //   }
  // });
  // return hashPW;
}

function comparePW (password, hashedPW) {
  return bcrypt.compareSync(password, hashedPW);
  // body...
}

module.exports = {
  ensureAuthenticated: ensureAuthenticated,
  loginRedirect: loginRedirect,
  hashing: hashing,
  comparePW: comparePW
}