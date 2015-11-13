import * as animal from '../services/animal';

var express = require('express');
var router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/#login');
}

function consoleAndPass(content) {
    console.log(content);
    return content;
}
function errorAndPass(...content) {
    console.error(content);
    return content;
}

var responseJson = (req, res) => (d) => res.json(consoleAndPass(JSON.stringify(d)));
var responseError = (req, res) => (err) => res.json(errorAndPass(err, JSON.stringify(err)));

var post = (req, res) => animal
    .create(req.body.animal, req.user.id)
    .then(responseJson(req, res))
    .catch(responseError(req, res));

var get = (req, res) => animal
    .get(req.params.id)
    .then(responseJson(req, res))
    .catch(responseError(req, res));

var listByUser = (req, res) => animal
    .getByUser(req.user.id)
    .then(responseJson(req, res))
    .catch(responseError(req, res));

var listByKind = (req, res) => animal
    .getByKind(req.params.id)
    .then(responseJson(req, res))
    .catch(responseError(req, res));

router.post('/', ensureAuthenticated, post);
router.get('/:id', ensureAuthenticated, get);
router.get('/', ensureAuthenticated, listByUser);
router.get('/kind/:id', ensureAuthenticated, listByKind);

module.exports = router;
