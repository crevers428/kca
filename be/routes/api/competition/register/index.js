var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Competition = require('../../../../models/competitions')
const Registration = require('../../../../models/registrations')
const Validator = require('../../../../validators/regs')
const moment = require('moment')

const updateRegsSummary = async function(compId) {

    const numbers = await Promise.all([
        Registration.find({_comp: compId, status: 0, deleted: 0 }).count(),
        Registration.find({_comp: compId, status: 1, deleted: 0 }).count(),
        Registration.find({_comp: compId, status: 2, deleted: 0 }).count(),
        Registration.find({_comp: compId, deleted: 1 }).count()
    ])

    return Competition.updateOne(
        { id: compId },
        { $set: {
            'regs.yet': numbers[0],
            'regs.ok': numbers[1],
            'regs.check': numbers[2],
            'regs.del': numbers[3]
        } }
    )
}

const updateEventsSummary = async function(comp) {
    const evs = await Promise.all(comp.eventsDetail.map(async ev => {
        const num = await Registration.find({ _comp: comp.id, status: { $gte: 1 }, events: ev.event }).count()
        ev.num = num
    }))

    return Competition.updateOne(
        { id: comp.id },
        { $set: { eventsDetail: comp.eventsDetail } }
    )
}

router.get('/', function(req, res, next) {

    Registration.find({ _comp: req.compId })
        .then(r => {
            res.send({ regs: r })
        })
        .catch(e => {
            return next(createError(400, e.message))
        })
})

router.post('/', async (req, res, next) => {
    const body = req.body
    const reg = new Registration({ _comp: req.compId })

    try{
        const comp = await Competition.findOne({ id: req.compId })
        if(!comp) throw new Error('Not Found Comp')

        const validate = await Promise.all([
            Validator.name(body.name),
            Validator.email(body.email),
            Validator.division(body.division),
            Validator.birthday(body.birthday),
            Validator.events(body.events, comp.events),
        ])

        reg.name = body.name
        reg.email = body.email
        reg.division = body.division
        reg.birthday = body.birthday
        reg.events = body.events

        // 대회 정보도 업데이트 해야함..
        const rs = await reg.save()

        const rcu = await updateRegsSummary(req.compId)

        res.status(201).send({ newReg: rs._id })
    }
    catch (e) {
        return next(createError(400, e.message))
    }
})

router.put('/:_id', async (req, res, next) => {
    const _id = req.params._id
    const body = req.body
    const u = {}

    try{
        const comp = await Competition.findOne({ id: req.compId })
        if(!comp) throw new Error("Not Found Comp")
        const reg = await Registration.findOne({ _id })
        if(!reg) throw new Error("Not Found Reg")

        const validate = await Promise.all([
            Validator.name(body.name)
                .then(val => {
                    if(reg.name != val) {
                        u.name = val
                    }
                })
                .catch(e => {
                    if(body.name != undefined) throw e
                }),
            Validator.email(body.email)
                .then(val => {
                    if(reg.email != val) {
                        u.email = val
                    }
                })
                .catch(e => {
                    if(body.email != undefined) throw e
                }),
            Validator.division(body.division)
                .then(val => {
                    if(reg.division != val) {
                        u.division = val
                    }
                })
                .catch(e => {
                    if(body.division != undefined) throw e
                }),
            Validator.birthday(body.birthday)
                .then(val => {
                    if(reg.birthday != val) {
                        u.birthday = val
                    }
                })
                .catch(e => {
                    if(body.birthday != undefined) throw e
                }),
            Validator.events(body.events, comp.events)
                .then(val => {
                    if(JSON.stringify(reg.events) != JSON.stringify(val)) {
                        u.events = val
                    }
                })
                .catch(e => {
                    if(body.events != undefined) throw e
                }),
            Validator.deleted(body.deleted)
                .then(val => {
                    if(reg.deleted != val) {
                        u.deleted = val
                    }
                })
                .catch(e => {
                    if(body.deleted != undefined) throw e
                }),
            Validator.status(body.status)
                .then(val => {
                    if(reg.status != val) {
                        u.status = val
                    }
                })
                .catch(e => {
                    if(body.status != undefined) throw e
                })
        ])

        if(u.status != undefined && u.deleted != undefined) throw new Error("Invalid values : status deleted")
        // same as before
        if(JSON.stringify(u) == JSON.stringify({})) return res.status(200).send()

        const ru = await Registration.updateOne({ _id }, { $set: u })

        // if deleted or change status apply to comps-
        if(u.status != undefined || u.deleted != undefined) {
            const rcur = await updateRegsSummary(req.compId)
        }

        // events changed or un/approve reg
        if(( u.events != undefined || u.status * reg.status == 0 ) && u.deleted == undefined && reg.deleted == 0) {
            const rcue = await updateEventsSummary(comp)
        }

        res.status(200).send()
    }
    catch (e) {
        console.log(e)
        return next(createError(400, e.message))
    }
})

router.delete('/:_id', (req, res, next) => {
    next(createError(404));
})


router.all('*', function(req, res, next) {
    next(createError(404));
});

module.exports = router;
