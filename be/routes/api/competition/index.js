var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Competition = require('../../../models/competitions')
const Registration = require('../../../models/registrations')
const moment = require('moment')
const Validator = require("../../../validators/comps")

router.get('/', function(req, res) {
    Competition.find().sort({ 'date.end': -1 })
        .then(r => {
            res.send({ success: true, comps: r})
        })
        .catch(e => {
            res.send({ success: false })
        })
})

router.get('/:id', function(req, res) {
    Competition.findOne({ id: req.params.id })
        .then(r => {
            if(!r) throw new Error('Not found comp')
            res.send({ success: true, comp: r })
        })
        .catch(e => {
            res.status(404).send({message: e.message})
        })
})

router.all('/:id/*', function(req, res, next) {
    req.compId = req.params.id
    next()
})
router.use('/:id/register', require('./register'))

router.all('*', function(req, res, next){
    if(req.user.lv > 0) return next(createError(404))
    next()
})

router.post("/", async (req, res, next) => {
    const body = req.body
    const comp = new Competition()

    try {
        const validation = await Promise.all([
            Validator.name(body.name),
            Validator.date(body.date),
            Validator.events(body.events),
        ])
        comp.name = validation[0]
        comp.id = Validator.makeId(comp.name)
        comp.date = validation[1]
        comp.events = validation[2]
        comp.events.forEach((ev) => {
            comp.eventsDetail.push({
                event: ev
            })
        })
        const rs = await comp.save()
        res.status(201).send({ newId: rs.id })
    }
    catch (e) {
        return next(createError(400, e.message))
    }
})

router.put('/:id', async (req, res, next) => {
    let id = req.params.id
    const body = req.body
    const u = {}

    try{
        const comp = await Competition.findOne({ id })

        const validate = await Promise.all([
            Validator.name(body.name)
                .then(val => {
                    if(comp.name != val) {
                        u.name = val
                        u.id = Validator.makeId(u.name)
                    }
                })
                .catch(e => {
                    if(body.name != undefined) throw e
                }),
            Validator.date(body.date)
                .then(val => {
                    if(JSON.stringify(comp.date) != JSON.stringify(val)) {
                        u.date = val
                    }
                })
                .catch(e => {
                    if(body.date != undefined) throw e
                }),
            Validator.events(body.events)
                .then(val => {
                    if(JSON.stringify(comp.events) != JSON.stringify(val)) {
                        u.events = val
                    }
                })
                .catch(e => {
                    if(body.events != undefined) throw e
                })
        ])

        // same as before
        if(JSON.stringify(u) == JSON.stringify({})) return res.status(200).send()

        if(u.events != undefined) {
            u.eventsDetail = []
            // 새 종목 등록
            u.events.forEach(ev => {
                const i = comp.events.indexOf(ev)
                if(i < 0) {
                    u.eventsDetail.push({ event: ev })
                }
                else {
                    u.eventsDetail.push(comp.eventsDetail[i])
                }
            })
            // 없어지는 종목 중에서, 이미 진행중이면 에러 발생
            await Promise.all(comp.eventsDetail.map(async (ev) => {
                const i = u.events.indexOf(ev.event)
                if(i < 0 ) {
                    if(ev.rounds.length > 0) throw new Error("Opened Event : " + ev.event)
                    await Registration.updateMany(
                        { _comp: id },
                        { $pull: { events: ev.event } }
                    )
                }
            }))
        }

        const ru = await Competition.updateOne({ id }, { $set: u })
        const newId = (u.id) ? u.id : id

        res.status(200).send({ newId: newId })
    }
    catch (e) {
        return next(createError(400, e.message))
    }
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    Competition.deleteOne({ id: id })
        .then(rd => {
            res.status(200).send()
        })
        .catch(e => {
            return next(createError(400, e.message))
        })
})

router.all('*', function(req, res, next) {
    next(createError(404));
});

module.exports = router;
