import * as animal from '../services/animal';

var express = require('express');
var router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/#login');
}

var responseJson = (d) => res.json(d);
var post = (req, res) => animal.create(req.body.animal, req.user.id).then(responseJson);
var get = (req, res) => animal.get(req.params.id).then(responseJson);

router.post('/', ensureAuthenticated, post);
router.get('/:id', ensureAuthenticated, get);

module.exports = router;
