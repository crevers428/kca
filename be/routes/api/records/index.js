var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Competition = require('../../../models/competitions')
const Record = require("../../../models/records")
const moment = require('moment')

router.get('/', function(req, res) {
    Competition.find()
        .then(r => {
            res.send({ success: true, comps: r})
        })
        .catch(e => {
            res.send({ success: false })
        })
})

router.all('/:compId/*', function(req, res, next) {
    req.compId = req.params.compId
    next()
})
router.use('/:compId/results', require('./results'))

router.all('*', function(req, res, next) {
    next(createError(404));
});

module.exports = router;
