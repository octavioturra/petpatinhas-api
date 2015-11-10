var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', (req, res, next) =>
  res.render('index', {
    title: 'Express',
    user: false
  })
);

function ensureAuthenticated(req, res, next) {
  console.log(req);
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/#login');
}

/* GET home page. */
router.get('/loggedIn', ensureAuthenticated, (req, res, next) =>
  res.render('index', {
    title: 'Express',
    user: req.user || console.log(req.user)
  })
);


module.exports = router;
