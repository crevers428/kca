const mongoose = (module.parent.exports.mongoose) ? module.parent.exports.mongoose : require('mongoose')
const cfg = require('../../config')

mongoose.set('useCreateIndex', true)
const recordSchema = new mongoose.Schema({
    compId: { type: String, default: '', index: true},
    compName: { type: String, default: '' },
    personId: { type: String, default: '', index: true },
    personName: { type: String },
    event: {
        type: String,
        enum: ['222', '333', '444', '555', '666', '777',
            '333bf', '333oh', '333fmc' ,'333ft', 'minx', 'pyram',
            'sq1', 'skewb', 'clock', '444bf', '555bf', '333mbf',
            '332', '223', 'ivy', '222br', '333br', '444br',
            'pyrambr', 'skewbbr', 'mirror', 'mirrorbr', 'gear']
    },
    date: { type: Date }, // if undefined, the last time of the round or comp date
    type: { type: String, default: 'a', enum: ['a', 'm', '3', '2', '1'] },
    round: { type: Number, default: 1, enum: [1, 2, 3, 4] },
    isFinal: { type: Boolean },
    place: { type: Number },
    detail: [{ type: Number, default: 0 }],
    best: { type: Number, default: 0 },
    mean: { type: Number },
    worst: { type: Number, default: 0 },
    nrSingle: { type: Boolean, default: false },
    nrMean: { type: Boolean, default: false },
    pbSingle: { type: Boolean, default: false },
    pbMean: { type: Boolean, default: false }
})

module.exports = mongoose.model('Record', recordSchema)
