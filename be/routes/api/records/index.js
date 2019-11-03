var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Competition = require('../../../models/competitions')
const Record = require("../../../models/records")
const moment = require('moment')

router.get('/person/:id', function(req, res) {
    Record.find({ personId: req.params.id })
        .sort({ date: -1, round: -1,  })
        .then(records => {
            const mod = {}
            records.forEach(r => {
                if(mod[r.event] == undefined) {
                    mod[r.event] = []
                }
                mod[r.event].push(r)
            })
            res.send({ history: mod })
        })
        .catch(e => {
            return next(createError(400, e.message))
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
