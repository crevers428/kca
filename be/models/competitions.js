const mongoose = (module.parent.exports.mongoose) ? module.parent.exports.mongoose : require('mongoose')
const cfg = require('../../config')
const moment = require('moment')
const Person = require('./people.js')
const Record = require('./records.js')

mongoose.set('useCreateIndex', true)

const competitionSchema = new mongoose.Schema({
    id: {
        type: String,
        default: '',
        unique: true,
        required: true
    },
    name: {
        type: String,
        default: '',
        trim: true,
        match: /^[가-힣a-zA-Z0-9\s]{6,50}$/
    },
    date: {
        start: {
            type: Date,
            default: moment()._d,
            // validate: [
            //     function (date) {
            //         return moment(date).diff(new Date(), 'days') >= 0
            //     },
            //     'invalid start date'
            // ]
        },
        end: {
            type: Date,
            default: moment()._d,
            validate: [
                function (date) {
                    let start = null
                    if(!this.date){
                        start = this.getUpdate().$set.date.start
                    } else {
                        start = this.date.start
                    }

                    return moment(date).diff(start, 'days') >= 0
                },
                'invalid end date'
            ]
        }
    },
    events: [Record.schema.obj.event],
    eventsDetail: [{
        event: Record.schema.obj.event,
        num: { type: Number, default: 0 },
        rounds: [{
            round: Record.schema.obj.round,
            state: { type: Number, default: 0, enum: [0,1,2] },
            type: Record.schema.obj.type,
            num: { type: Number, default: 0 }
        }]
    }],
    regs: {
        yet: { type: Number, default: 0 },
        ok: { type: Number, default: 0 },
        check: { type: Number, default: 0 },
        del: { type: Number, default: 0 }
    }
})

module.exports = mongoose.model('Competition', competitionSchema)
