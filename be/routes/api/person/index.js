var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Person = require('../../../models/people')
const Competition = require('../../../models/competitions');
const moment = require('moment')


router.get('/', function(req, res, next) {
    Person.find()
        .then(r => {
            res.send({ success: true, comps: r})
        })
        .catch(e => {
            res.send({ success: false })
        })
})

router.get('/:id', function(req, res, next) {
    Person.findOne({ id: req.params.id })
        .then(r => {
            res.send({ success: true, comp: r })
        })
        .catch(e => {
            res.send({ success: false, msg: 'Not found comp' })
        })
})

router.post('/', (req, res) => {
    const { name, date, events } = req.body
    const c = new Competition({ name, date, events })

    if(!c.name) return res.send({ success: false, msg: "missing form data : name" })
    if(!c.date) return res.send({ success: false, msg: "missing form data : date" })
    if(!c.events) return res.send({ success: false, msg: "missing form data : events" })
    c.id = c.name.replace(/\s/gi, "")

    c.save()
        .then(r => {
            res.send({ success: true })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.put('/:id', (req, res, next) => {
    let id = req.params.id
    const { name, date, events } = req.body

    Person.findOne({ id })
        .then((r) => {
            if(r.name != name) {
                id = name.replace(/\s/gi, "")
            }
            return Competition.updateOne(
                { _id: r._id },
                { $set: { name, date, events, id: id } },
                { runValidators: true, context: 'query' }
            )
        })
        .then(ru => {
            res.send({ success: true, newId: id })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    Person.deleteOne({ id: id })
        .then(rd => {this.comp = r.data.comp
            res.send({ success: true })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})


router.all('*', function(req, res, next) {
    next(createError(404));
});

module.exports = router;
