import * as user from '../services/user';

var passport = require('passport');
var FacebookStrategy = require('passport-facebook');

var express = require('express');
var router = express.Router();

var FACEBOOK_APP_ID = '386571188077980';
var FACEBOOK_APP_SECRET = '2c2f36d4d23cc6db98a9a8dcd8c30a65';

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        enableProof: false
    },
    function(accessToken, refreshToken, profile, done) {
        user.create(profile).then(
            (user) => (user) ? done(null, user) : done(new Error('Cannot save user'))
        );
    }
));

router.get('/login', function(req, res) {
    res.redirect('/auth/facebook');
});

router.get('/facebook',
    passport.authenticate('facebook', {
        display: 'touch'
    }));

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/auth/login'
    }),
    function(req, res) {
        res.redirect('/');
    });

module.exports = router;
