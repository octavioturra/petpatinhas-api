import * as animal from '../services/animal';
import * as rest from './rest';

var express = require('express');
var router = express.Router();

var post = (req, res) => animal
    .create(req.body.animal, req.user.id)
    .then(rest.responseJson(req, res))
    .catch(rest.responseError(req, res));

var get = (req, res) => animal
    .get(req.params.id)
    .then(rest.responseJson(req, res))
    .catch(rest.responseError(req, res));

var listByUser = (req, res) => animal
    .listByUser(req.user.id, req.query.page)
    .then(rest.responseJson(req, res))
    .catch(rest.responseError(req, res));

var listByKind = (req, res) => animal
    .listByKind(req.params.id, req.query.page)
    .then(rest.responseJson(req, res))
    .catch(rest.responseError(req, res));

router.post('/', rest.ensureAuthenticated, post);
router.get('/:id', rest.ensureAuthenticated, get);
router.get('/', rest.ensureAuthenticated, listByUser);
router.get('/kind/:id', rest.ensureAuthenticated, listByKind);

module.exports = router;
