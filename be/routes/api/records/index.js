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
            return res.send({ history: mod })
        })
        .catch(e => {
            return next(createError(400, e.message))
        })
})

router.get('/history/:ev/:type', function(req, res) {
    const type = (req.params.type == 'single') ? 'nrSingle' : 'nrMean'
    Record.find({ event: req.params.ev, [type]: true })
        .sort({ date: -1 })
        .then(r => {
            return res.send({ r: r})
        })
        .catch(e => {
            return next(createError(400, e.message))
        })
})

router.get('/search/:keyword', async function(req, res, next) {
    const keyword = req.params.keyword
    const split = keyword.split(" ")
    const ofc = Record.schema.obj.event.enum
    let results = []

    for (let k of split) {
        if(k.length < 2) return res.send({ short: true })
    }

    try {
        const cond = {}
        if(split.length === 1) {
            cond.personName = { $regex: '.*' + split[0] + '.*'}
        }
        else if(split.length === 2) {
            if(ofc.indexOf(split[1]) >= 0) {
                cond.event = split[1]
                cond.$or = [
                    { compName: { $regex: '.*' + split[0] + '.*'} },
                    { compId: { $regex: '.*' + split[0] + '.*'} },
                    { personName: { $regex: '.*' + split[0] + '.*'} }
                ]
            }
            else {
                cond.$or = [
                    { compName: { $regex: '.*' + split[0] + '.*'} },
                    { compId: { $regex: '.*' + split[0] + '.*'} },
                ]
                cond.personName = { $regex: '.*' + split[1] + '.*'}
            }
        }
        else if(split.length === 3) {
            cond.$or = [
                { compName: { $regex: '.*' + split[0] + '.*'} },
                { compId: { $regex: '.*' + split[0] + '.*'} },
            ]
            cond.event = split[1]
            cond.personName = { $regex: '.*' + split[2] + '.*'}
        }
        else {
            return res.send(results)
        }
        results = await Record.find(cond).sort({ date: -1, event: 1, round: -1 })

        return res.send({ results: results })

    }
    catch (e) {
        return next(createError(400, e.message))
    }
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
