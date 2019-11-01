const mongoose = (module.parent.exports.mongoose) ? module.parent.exports.mongoose : require('mongoose')
const cfg = require('../../config')
const moment = require('moment')
const Record = require('./records')
const Person = require("./people")

mongoose.set('useCreateIndex', true)
const registrationSchema = new mongoose.Schema({
    _comp: { type: String, required: true },
    id: {
        type: String, default: ''
    },
    name: Person.schema.obj.name,
    division: Person.schema.obj.division,
    birthday: Person.schema.obj.birthday,
    email: { type: String, default: '', match: /.+@.+\..+/ },
    events: [Record.schema.obj.event],
    regDate: { type: Date, default: new Date() },
    deleted: { type: Number, default: 0, enum: [0, 1] },
    status: { type: Number, default: 0, enum: [0, 1, 2] } // 0: submited, 1: approve, 2: registerd
})

module.exports = mongoose.model('Registration', registrationSchema)
