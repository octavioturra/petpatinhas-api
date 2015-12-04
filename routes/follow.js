import * as follow from '../services/social_actions';
import * as rest from './rest';

var express = require('express');
var router = express.Router();

var list = (req, res) => follow
    .following(req.user.id)
    .then(rest.responseJson(req, res))
    .catch(rest.responseError(req, res));


var post = (req, res) => follow
    .follow(req.user.id, req.params.animalId)
    .then(rest.responseJson(req, res))
    .catch(rest.responseError(req, res));

var del = (req, res) => follow
    .unfollow(req.user.id, req.params.animalId)
    .then(rest.responseJson(req, res))
    .catch(rest.responseError(req, res));

router.get('/', rest.ensureAuthenticated, list);
router.post('/:animalId', rest.ensureAuthenticated, post);
router.delete('/:animalId', rest.ensureAuthenticated, del);

module.exports = router;
