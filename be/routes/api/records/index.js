var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const mongoose = require('mongoose')
const moment = require('moment')
const Competition = require('../../../models/competitions')
const Record = require("../../../models/records")
const RecordTool = require("../../../modules/records/tool")
const RecordMod = require('../../../modules/records/mod')

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

router.get('/mod/:_id', function(req, res, next) {
    Record.findOne({ _id: req.params._id })
        .then(r => {
            res.send({ r: r })
        })
        .catch(e => {
            return next(createError(400, e.message))
        })
})

router.put('/mod/:_id', async function(req, res, next) {
    const detail = req.body.detail
    const _id = req.params._id

    try {
        if(Object.prototype.toString.call(detail) != '[object Array]' || detail.length == 0) {
            throw new Error("Invalid value: detail.notArray")
        }

        await RecordMod.modTimes(_id, detail)

        return res.send()
    }
    catch (e) {
        console.log(e)
        return next(createError(400, e.message))
    }
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
