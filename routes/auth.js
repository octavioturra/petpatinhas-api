import * as user from '../services/user';

var passport = require('passport');
var FacebookStrategy = require('passport-facebook');

var express = require('express');
var router = express.Router();

var FACEBOOK_APP_ID = '386571188077980';
var FACEBOOK_APP_SECRET = '2c2f36d4d23cc6db98a9a8dcd8c30a65';

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

var strategy = (cb)=> new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  enableProof: false
}, cb);

var userCreated = (done) => (user) => (user) ? done(null, user) : done(new Error('Cannot save user'));
var successLogin = (accessToken, refreshToken, profile, done) => user.create(profile).then(userCreated(done));
var authenticate = passport.authenticate('facebook', {
  failureRedirect: '/auth/login'
});
var onLogin = (req, res) => res.redirect('/auth/facebook');
var loginCallback = (req, res) => res.redirect('/loggedIn');

passport.use(strategy(successLogin));

router.get('/login', onLogin);
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', authenticate, loginCallback);

module.exports = router;
