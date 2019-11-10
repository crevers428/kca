const mongoose = (module.parent.exports.mongoose) ? module.parent.exports.mongoose : require('mongoose')

const Record = require('../../models/records')
const RankingsMean = require('../../models/rankingsMean')
const RankingsSingle = require('../../models/rankingsSingle')
const Competition = require('../../models/competitions')

const tool = require('./tool')
const moment = require('moment')
const test = function () {
    return new Promise(function (resolve, reject) {
        return reject(new Error('hi'))
    })
}
const mod = {
    place: function(record) {
        return new Promise(async function(resolve, reject) {
            try {
                const condition = {
                    compId: record.compId,
                    event: record.event,
                    round: record.round
                }
                if(record.type == 'a' || record.type == 'm') {
                    if(record.mean > 0) {
                        condition.$or = [
                            { mean: { $lt: record.mean, $gt: 0 } },
                            {
                                best: { $lt: record.best, $gt: 0 },
                                mean: record.mean
                            }
                        ]
                    }
                    else {
                        if(record.best > 0) {
                            condition.$or = [
                                { mean: { $gt: 0 } },
                                {
                                    best: { $lt: record.best, $gt: 0 },
                                    mean: { $lte: 0 }
                                }
                            ]
                        }
                        else {
                            condition.best = { $gt: 0 }
                            condition.mean = { $gt: 0 }
                        }
                    }
                }
                else {
                    if(record.best > 0) {
                        condition.best = { $lte: record.best, $gt: 0 }
                    }
                    else {
                        condition.best = { $gt: 0 }
                    }
                }

                const counting = await Record.find(condition).countDocuments()
                const ru = await Record.updateOne({ _id: record._id }, { $set: { place: counting + 1 } })

                return resolve()
            }
            catch (e) {
                return reject(e)
            }
        })
    },
    placing: function(compId, event, round) {
        return new Promise(async function(resolve, reject) {
            try {
                const records = await Record.find({ compId: compId, event: event, round: round})
                const all = await Promise.all(records.map(record => mod.place(record)))

                return resolve()
            }
            catch (e) {
                return reject(e)
            }
        })
    },

    checkPb: function(record, isMean) {
        const field = (isMean) ? 'mean' : 'best'
        const pbField = (isMean) ? 'pbMean' : 'pbSingle'
        const time = (isMean) ? record.mean : record.best
        return new Promise(async function(resolve, reject) {
            try {
                let pb = false
                if(record[field] > 0 && (!isMean || record.type == 'm' || record.type == 'a')) {
                    const check = await Record.find({
                        personId: record.personId,
                        event: record.event,
                        [field]: { $lt: time, $gt: 0 },
                        $or: [
                            { date: { $lt: record.date } },
                            { date: record.date, round: { $lt: record.round } }
                        ]
                    }).countDocuments()

                    if(check === 0) {
                        pb = true
                    }
                }
                return resolve(pb)
            }
            catch(e) {
                return reject(e)
            }
        })
    },
    setPb: function(record, oldRecord, isMean) {
        const field = (isMean) ? 'mean' : 'best'
        const pbField = (isMean) ? 'pbMean' : 'pbSingle'
        return new Promise(async function(resolve, reject) {
            if(isMean && !tool.checkMean(record.event, record.type)) {
                resolve(false)
            }

            try{
                let pb = oldRecord[pbField]
                if(pb) { // oldRecord[field] > 0
                    if(oldRecord[field] < record[field] || record[field] <= 0) {
                        pb = await mod.checkPb(record, isMean)
                        const nextPb = await Record.findOne({
                            event: record.event,
                            personId: record.personId,
                            [pbField]: true,
                            $or: [
                                { date: record.date, round: { $gt: record.round } },
                                { date: { $gt: record.date } }
                            ]
                        })
                        .sort({ date: 1 })
                        const currentPb = (pb)
                            ? record
                            : await Record.findOne({
                                event: record.event,
                                personId: record.personId,
                                [pbField]: true,
                                $or: [
                                    { date: record.date, round: { $lt: record.round } },
                                    { date: { $lt: record.date } }
                                ]
                            })
                            .sort({ date: -1 })


                        const cond = {
                            event: record.event,
                            personId: record.personId,
                            [field]: (!currentPb) ? { $gt: 0 } : { $lte: currentPb[field], $gt: 0 }
                        }
                        if(nextPb) {
                            cond.$or = [
                                { date: nextPb.date, round: { $lt: nextPb.round } },
                                { date: { $lt: nextPb.date } }
                            ]
                        }
                        if(currentPb) {
                            if(nextPb) {
                                cond.$or[1].date.$gt = currentPb.date
                                cond.$or[2] = { date: currentPb.date, round: {$gt: currentPb.round } }
                            } else {
                                cond.$or = [
                                    { date: { $gt: currentPb.date } },
                                    { date: currentPb.date, round: {$gt: currentPb.round } }
                                ]
                            }
                        }

                        const needUpdate = await Record.find(cond)
                        .sort({ date: 1, round: 1 })

                        let setPb = null
                        for (let r of needUpdate) {
                            if(setPb == null || setPb >= r[field]) {
                                setPb = r[field]
                                const chk = await mod.checkPb(r, isMean)
                                await Record.updateOne({ _id: r._id }, { $set: { [pbField]: true } })
                            }
                        }
                    }
                    else if(oldRecord[field] > record[field]) {
                        const cond = {
                            event: record.event,
                            personId: record.personId,
                            [pbField]: true,
                            [field]: { $gt: record[field] },
                            $or: [
                                { date: record.date, round: { $gt: record.round } },
                                { date: { $gt: record.date } }
                            ]
                        }

                        const needUpdate = await Record.updateMany(
                            cond,
                            { $set: { [pbField]: false }
                        })

                        console.log(needUpdate)
                    }
                }
                else {
                    if(record[field] > 0 && (oldRecord[field] <= 0 || oldRecord[field] > record[field])) {
                        pb = await mod.checkPb(record, isMean)
                        if(pb) {
                            const cond = {
                                event: record.event,
                                personId: record.personId,
                                [pbField]: true,
                                [field]: { $gt: record[field] },
                                $or: [
                                    { date: record.date, round: { $gt: record.round } },
                                    { date: { $gt: record.date } }
                                ]
                            }

                            const needUpdate = await Record.updateMany(
                                cond,
                                { $set: { [pbField]: false }
                            })
                        }
                    }
                }
                resolve(pb)
            }
            catch (e) {
                reject(e)
            }
        })
    },
    pbByMod: function (record, oldRecord) {
        return new Promise(async function(resolve, reject) {
            try{
                const set = await Promise.all([
                    mod.setPb(record, oldRecord),
                    mod.setPb(record, oldRecord, true)
                ])

                record.pbSingle = set[0]
                record.pbMean = set[1]
                return resolve(record)
            }
            catch (e) {
                return reject(e)
            }
        })
    },

    checkNr: function (record, isMean) {
        return new Promise(async function(resolve, reject) {
            try {
                const field = (isMean) ? 'mean' : 'best'
                const nrField = (isMean) ? 'pbMean' : 'pbSingle'
                let nr = false
                let time = (isMean) ? record.mean : record.best

                if(time > 0 && (!isMean || record.type == 'a' || record.type == 'm')) {
                    const check = await Record.find({
                        event: record.event,
                        date: { $lte: record.date },
                        [field]: { $lt: time, $gt: 0 }
                    }).countDocuments()

                    const check1 = await Record.find({
                        event: record.event,
                        date: { $lte: record.date },
                        [field]: { $lt: time, $gt: 0 }
                    })

                    if(check === 0) {
                        nr = true
                    }
                }
                return resolve(nr)
            }
            catch(e) {
                reject(e)
            }
        })
    },
    setNr: function (afterPb, oldRecord, isMean) {
        const field = (isMean) ? 'mean' : 'best'
        const nrField = (isMean) ? 'nrMean' : 'nrSingle'
        const pbField = (isMean) ? 'pbMean' : 'pbSingle'

        return new Promise(async function(resolve, reject) {
            if(isMean && !tool.checkMean(afterPb.event, afterPb.type)) {
                resolve(false)
            }

            try {
                let nr = oldRecord[nrField]
                if(nr) {
                    if(oldRecord[field] < afterPb[field] || afterPb[field] <= 0) {
                        nr = await mod.checkNr(afterPb, isMean)
                        const nextNr = await Record.findOne({
                                event: afterPb.event,
                                [nrField]: true,
                                date: { $gt: afterPb.date }
                            })
                            .sort({ date: 1 })

                        const currentNr = (nr)
                            ? afterPb
                            : await Record.findOne({
                                event: afterPb.event,
                                [nrField]: true,
                                date: { $lte: afterPb.date }
                            })
                            .sort({ date: -1 })

                        const cond = {
                            event: afterPb.event,
                            [field]: (!currentNr) ? { $gt: 0 } : { $lte: currentNr[field], $gt: 0 },
                        }

                        if(nextNr) {
                            cond.date = { $lt: nextNr.date }
                        }

                        if(currentNr) {
                            if(nextNr) {
                                cond.date.$gte = currentNr.date
                            }
                            else {
                                cond.date = { $gte: currentNr.date }
                            }
                        }

                        const needUpdate = await Record.find(cond)
                            .sort({ date: 1 })

                        let setNr = null
                        for (let r of needUpdate) {

                            if(setNr == null || setNr >= r[field]) {
                                setNr = r[field]

                                const chk = await mod.checkNr(r, isMean)
                                if(chk) {
                                    await Record.updateOne({ _id: r._id }, { $set: { [nrField]: true } })
                                }
                            }
                        }
                    }
                    else if(oldRecord[field] > afterPb[field]){
                        const nextNr = await Record.findOne({
                                event: afterPb.event,
                                [nrField]: true,
                                [field]: { $lte: afterPb[field] }
                            })
                            .sort({ date: 1 })
                        const needUpdate = await Record.updateMany(
                            {
                                event: afterPb.event,
                                date: (!nextNr) ? { $gte: afterPb.date } : { $gte: afterPb.date, $lt: nextNr.date },
                                [field]: { $gt: afterPb[field] },
                                [nrField]: true
                            },
                            { $set: { [nrField]: false }
                        })
                    }
                }
                else {
                    if(oldRecord[field] > afterPb[field] && afterPb[pbField]) {
                        nr = await mod.checkNr(afterPb, isMean)
                        if(nr) {
                            const nextNr = await Record.findOne({
                                    event: afterPb.event,
                                    [nrField]: true,
                                    [field]: { $lte: afterPb[field] }
                                })
                                .sort({ date: 1 })

                            const needUpdate = await Record.updateMany(
                                {
                                    event: afterPb.event,
                                    date: (!nextNr) ? { $gte: afterPb.date } : { $gte: afterPb.date, $lte: nextNr.date },
                                    [field]: { $gt: afterPb[field] },
                                    [nrField]: true
                                },
                                { $set: { [nrField]: false }
                            })
                        }
                    }
                }
                return resolve(nr)
            }
            catch(e) {
                return reject(e)
            }
        })
    },
    nrByMod: function (afterPb, oldRecord) {
        return new Promise(async function(resolve, reject) {
            try {
                const set = await Promise.all([
                    mod.setNr(afterPb, oldRecord),
                    mod.setNr(afterPb, oldRecord, true)
                ])
                afterPb.nrSingle = set[0]
                afterPb.nrMean = set[1]
                return resolve(afterPb)
            }
            catch(e) {
                return reject(e)
            }
        })
    },

    popRank: function(rank, isMean) {
        const db = (isMean) ? RankingsMean : RankingsSingle
        return new Promise(async function(resolve, reject) {
            try {
                const stand = rank.rank
                await db.deleteOne({ _id: rank._id })
                await db.updateMany({ event: rank.event, rank: { $gt: stand } }, { $inc: { rank: -1 } })
                return resolve()
            }
            catch(e) {
                return reject(e)
            }
        })
    },

    newRank: function(record, isMean) {
        const db = (isMean) ? RankingsMean : RankingsSingle
        let stand = (isMean) ? record.mean : record.best
        return new Promise(async function(resolve, reject) {
            if(stand == null || stand <= 0) {
                return resolve()
            }

            try {
                const ranked = await db.findOne({ event: record.event, personId: record.personId })
                if(!ranked || ranked.record >= stand) {
                    const newRank = new db({
                        personName: record.personName,
                        personId: record.personId,
                        compName: record.compName,
                        compId: record.compId,
                        date: record.date,
                        record: stand,
                        event: record.event
                    })

                    if(isMean) {
                        newRank.detail = record.detail
                    }

                    const chkRankUp = await db
                        .findOne({ event: record.event, record: { $gte: newRank.record } }, { record: 1 })
                        .sort({ record: 1 })
                        .limit(1)
                    const chkRankDownCnt = await db.find({ event: record.event, record: { $lt: newRank.record } }).countDocuments()

                    const updateRange = {}

                // set new Rank
                    newRank.rank = chkRankDownCnt + 1

                // update range upper
                    if(chkRankUp != null && newRank.record == chkRankUp.record) { // tie
                        updateRange.$gt = newRank.rank
                    }
                    else {
                        updateRange.$gte = newRank.rank
                    }

                // update range lower
                    if(ranked) {
                        await db.deleteOne({ _id: ranked._id })
                        updateRange.$lte = ranked.rank
                    }

                    const update = await db.updateMany({ event: record.event, rank: updateRange }, { $inc: { rank: 1 } })
                    const insert = await newRank.save()
                }
                return resolve()
            }
            catch (e) {
                return reject(e)
            }
        })
    },

    lowerRank: function(record, isMean) {
        const db = (isMean) ? RankingsMean : RankingsSingle
        return new Promise(async function(resolve, reject) {
            try {
                return resolve()
            }
            catch(e) {
                return reject(e)
            }
        })
    },

    setRank: function (personId, ev, isMean) {
        const db = (isMean) ? RankingsMean : RankingsSingle
        const field = (isMean) ? 'mean' : 'best'
        return new Promise(async function(resolve, reject) {
            try {
                const getBestCond = { event: ev, personId: personId, [field]: { $gt: 0 } }
                if(isMean) {
                    if(ev == '333mbf') {
                        return resolve()
                    }
                    else if(ev == '666' || ev == '777') {
                        getBestCond.type = 'm'
                    }
                    else {
                        getBestCond.type = 'a'
                    }
                }
                const getBest = await Record.findOne(getBestCond).sort({ [field]: 1 })
                const rank = await db.findOne({ event: ev, personId: personId })

                if(!rank) {
                    if(getBest) {
                        await mod.newRank(getBest, isMean)
                    }
                }
                else {
                    if(!getBest) {
                        await mod.popRank(rank, isMean)
                    }
                    else {
                        if(getBest[field] > rank.record) {
                        // lowerRank
                            await mod.popRank(rank, isMean)
                            await mod.newRank(getBest, isMean)
                        }
                        else if(getBest[field] < rank.record) {
                            await mod.newRank(getBest, isMean)
                        }
                        else {
                            const rankedComp = await Competition.findOne({ id: rank.compId })
                            const diff = moment(getBest.date).diff(rankedComp.date.end)

                            if(diff > 0) {
                                await db.upateOne({ _id: rank._id }, { $set: { compId: getBest.compId, compName: getBest.compName } })
                            }
                        }
                    }
                }
                return resolve()
            }
            catch (e) {
                return reject(e)
            }
        })
    },
    ranking: function (personId, ev) {
        return new Promise(async function(resolve, reject) {
            try {
                await Promise.all([
                    mod.setRank(personId, ev),
                    mod.setRank(personId, ev , true)
                ])
                resolve()
            }
            catch (e) {
                reject(e)
            }
        })
    },

    modTimes: function(_id, times) {
        return new Promise(async function(resolve, reject) {
            if(_id == undefined || times == undefined) return reject(new Error("invalid prameter."))
            try {
                const r = await Record.findOne({ _id: _id })
                const update = {
                    detail: times,
                    best: tool.getBest(times)
                }
                if(r.type == 'a' || r.type == 'm') {
                    update.mean = tool.getMean(times)
                }

                const detailUpdated = await Record.findOneAndUpdate({ _id: _id }, update, { new: true })
                await mod.placing(r.compId, r.event, r.round)
                const checkedPb = await mod.pbByMod(detailUpdated, r)
                const checkedNr = await mod.nrByMod(checkedPb, r)
                await Record.updateOne({ _id: checkedNr._id }, checkedNr)
                await mod.ranking(r.personId, r.event)

                return resolve()
            }
            catch(e) {
                return reject(e)
            }
        })
    }
}
module.exports = mod
