var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const RankingsSingle = require("../../../models/rankingsSingle")
const RankingsMean = require("../../../models/rankingsMean")

router.get('/:type(single|mean)/:ev/:limit?', function(req, res, next) {
    let db = null
    if(req.params.type == 'single') db = RankingsSingle
    else db = RankingsMean

    const limit = (!req.params.limit) ? 100 : Number(req.params.limit)
    
    db.find({ event: req.params.ev }).sort({ rank: 1 }).limit(limit)
        .then(r => {
            res.send({ ranking: r})
        })
        .catch(e => {
            next(createError(400, e.message))
        })
})

router.all('*', function(req, res, next) {
    next(createError(404));
});

module.exports = router;
