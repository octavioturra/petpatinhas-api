import * as animal from '../services/animal';

var express = require('express');
var router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/#login');
}

function consoleAndPass(content){
    console.log(content);
    return content;
}

var responseJson = (req, res) => (d) => res.json(d);
var responseError = (req, res) => (err) => res.json(err);

var post = (req, res) => animal
    .create(req.body.animal, req.user.id)
    .then(responseJson(req, res))
    .catch(responseError(req, res));
var get = (req, res) => animal
    .get(req.params.id)
    .then(responseJson(req, res));

router.post('/', ensureAuthenticated, post);
router.get('/:id', ensureAuthenticated, get);

module.exports = router;
