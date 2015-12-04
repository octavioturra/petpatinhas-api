import * as like from '../services/social_actions';
import * as rest from './rest';

var express = require('express');
var router = express.Router();

var list = (req, res) => like
    .liking(req.user.id)
    .then(rest.responseJson(req, res))
    .catch(rest.responseError(req, res));


var post = (req, res) => like
    .like(req.user.id, req.params.animalId)
    .then(rest.responseJson(req, res))
    .catch(rest.responseError(req, res));

var del = (req, res) => like
    .unlike(req.user.id, req.params.animalId)
    .then(rest.responseJson(req, res))
    .catch(rest.responseError(req, res));

router.get('/', rest.ensureAuthenticated, list);
router.post('/:animalId', rest.ensureAuthenticated, post);
router.delete('/:animalId', rest.ensureAuthenticated, del);

module.exports = router;
