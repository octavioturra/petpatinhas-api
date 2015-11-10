import * as user from '../services/user';
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');


var express = require('express');
var router = express.Router();

var FACEBOOK_APP_ID = '386571188077980';
var FACEBOOK_APP_SECRET = '2c2f36d4d23cc6db98a9a8dcd8c30a65';

function serializeUser(user, done) {
    done(null, user.id);
}

function deserializeUser(id, done) {
    user.get(id).then((user) => done(null, user));
}

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

var strategy = (cb) => new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, cb);

var userCreated = (done) => (user) => (user) ? done(null, user) : done(new Error('Cannot save user'));
var successLogin = (accessToken, refreshToken, profile, done) => user.create(profile).then(userCreated(done));
var authenticate = passport.authenticate('facebook', {
    successRedirect: '/loggedIn',
    failureRedirect: '/auth/login'
});
var onLogin = (req, res) => res.redirect('/auth/facebook');

passport.use(strategy(successLogin));

router.get('/login', onLogin);
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', authenticate);

module.exports = router;
