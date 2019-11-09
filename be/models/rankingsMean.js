const mongoose = (module.parent.exports.mongoose) ? module.parent.exports.mongoose : require('mongoose')
const cfg = require('../../config')
const Record = require('./records')

mongoose.set('useCreateIndex', true)
const rankingsMeanSchema = new mongoose.Schema({
    event: Record.schema.obj.event,
    rank: { type: Number, required: true },
    record: { type: Number, required: true },
    date: { type: Date, required: true },
    compId: { type: String, default: '' },
    compName: { type: String, default: '' },
    personId: { type: String, default: '', index: true },
    personName: { type: String },
    detail: [{ type: Number }]
})

module.exports = mongoose.model('rankingsMean', rankingsMeanSchema)
