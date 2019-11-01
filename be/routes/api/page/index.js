var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Page = require('../../../models/pages');

// add new pages by root
router.post('/', function(req, res, next) {
    const { name } = req.body
    Page.findOne({ name })
        .then((r) => {
            if (!r) {
                if (req.user.lv > 0) throw new Error(`not inspected by root`) // req.user.lv > 0
                return Page.create({ name })
            }
            if (r.lv < req.user.lv) throw new Error('permission denied')
            return Page.updateOne({ _id: r._id }, { $inc: { inCnt: 1 } })
        })
        .then((rc) => {
        //     return Page.find()
        // })
        // .then((rs) => {
        //     console.log(rs)
            res.send({ success: true })
        })
        .catch((e) => {
            res.send({ succes:false, msg: e.message })
        })
})

router.get('/', function(req, res, next) {
    Page.find()
        .then(r => {
            res.send({ success: true, pages: r})
        })
        .catch(e => {
            res.send({ success: false })
        })
})

router.put('/:_id', (req, res, next) => {
    const _id = req.params._id
    Page.updateOne({ _id }, { $set: req.body })
        .then(r => {
            res.send({ success: true, msg: r })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.delete('/:_id', (req, res, next) => {
    const _id = req.params._id
    Page.deleteOne({ _id })
        .then(r => {
            res.send({ success: true, msg: r})
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.all('*', function(req, res, next) {
    next(createError(404));
});

module.exports = router;
