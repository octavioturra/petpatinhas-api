import * as services from '../services';
import * as rest from './rest';

var express = require('express');
var router = express.Router();

var list = (req, res) => services
    .getConstant(req.params.constant)
    .then(rest.responseJson(req, res))
    .catch(rest.responseError(req, res));

router.get('/:constant', rest.ensureAuthenticated, list);

module.exports = router;
