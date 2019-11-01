var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Competition = require('../../../../models/competitions')
const Record = require("../../../../models/records")
const moment = require('moment')

router.get('/:event/:round/:limit?', async function(req, res, next) {
    const ev = req.params.event
    const round = req.params.round
    const limit = (req.params.limit == undefined) ? 999 : req.params.limit

    try {
        const compInfo = await Competition.findOne({ id: req.compId, 'eventsDetail.event': ev }, {'eventsDetail.$': 1})
        const roundInfo = compInfo.eventsDetail[0].rounds[Number(round) - 1]
        const type = roundInfo.type
        let sorting = {}

        if(type == 'a' || type == 'm') {
            sorting = {
                meanDnf: 1,
                mean: 1,
                bestDnf: 1,
                best: 1
            }
        }
        else {
            sorting = {
                bestDnf: 1,
                best: 1
            }
        }

        const records = await Record.aggregate()
            .match({ compId: req.compId, event: ev, round: round })
            .project({
                personId: 1,
                personName: 1,
                detail: 1,
                best: 1,
                worst: 1,
                mean: 1,
            })
            .addFields({
                meanDnf: {
                    $cond: {
                        if: { $lte: ["$mean", 0] },
                        then: 1,
                        else: 0
                    }
                },
                bestDnf: {
                    $cond: {
                        if: { $lte: ["$best", 0] },
                        then: 1,
                        else: 0
                    }
                }
            })
            .sort(sorting)
            .limit(Number(limit))
        if(!records) throw new Error("No Records")
        res.send({ records: records })
    }
    catch (e) {
        next(createError(400, e.message))
    }

})

router.all('*', function(req, res, next) {
    next(createError(404));
});

module.exports = router;
