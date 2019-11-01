const mongoose = (module.parent.exports.mongoose) ? module.parent.exports.mongoose : require('mongoose')
const cfg = require('../../config')
const moment = require('moment')

mongoose.set('useCreateIndex', true)
const personSchema = new mongoose.Schema({
    id: { type: String, match: /^[0-9][0-9][가-힣]{2}[0-9]{2}$/, unique: true },
    name: { type: String, required: true, match: /^[가-힣]{2,20}$/ },
    division: { type: String, default: '' },
    birthday: { type: String },
    // _user: { type: mongoose.Schema.Types.ObjectId, default: '', ref: 'User' }
})

module.exports = mongoose.model('Person', personSchema)
