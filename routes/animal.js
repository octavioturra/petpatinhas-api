import * as animal from '../services/animal';

var express = require('express');
var router = express.Router();

var responseJson = (d) => res.json(d);
var post = (req, res) => animal.create(req.body.animal, req.user.id).then(responseJson);
var get = (req, res) => animal.get(req.params.id).then(responseJson);

router.post('/', post);
router.get('/:id', get);

module.exports = router;
