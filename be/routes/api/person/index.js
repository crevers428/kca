var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Person = require('../../../models/people')
const Competition = require('../../../models/competitions');
const moment = require('moment')


router.get('/', function(req, res, next) {
    Person.find().limit(100)
        .then(r => {
            res.send({ success: true, comps: r})
        })
        .catch(e => {
            res.send({ success: false })
        })
})

router.get('/:id', function(req, res, next) {
    Person.findOne({ id: req.params.id })
        .then( r => {
            if(!r) return next(createError(404))
            res.send({ person: r })
        })
        .catch( e => {
            return next(createError(400, e.message))
        })
})

router.get('/search/:keyword', function(req, res, next) {
    const keyword = req.params.keyword
    if(keyword.length < 2) {
        return res.send({ short: true })
    }

    Person.find({ $or: [{ name: { $regex: '.*' + keyword + '.*'} }, { id: { $regex: '.*' + keyword + '.*'} } ] }).limit(100)
        .then(r => {
            res.send({ people: r })
        })
        .catch(e => {
            return next(createError(400, e.message))
        })
})

router.all('*', function(req, res, next) {
    next(createError(404));
});

module.exports = router;
