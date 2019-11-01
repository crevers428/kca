const mongoose = require('mongoose')
const cfg = require('../../config')


mongoose.set('useCreateIndex', true)
const userSchema = new mongoose.Schema({
    id: { type: String, default: '', index: true, unique: true },
    name: { type: String, default: '' },
    email: { type: String, default: '', unique: true },
    birthday: { type: Number, default: 00000000 },
    password: { type: String, default: '' },
    lv: { type: Number, default: 2 },
    inCnt: { type: Number, default: 0 },
    retry: { type: Number, default: 0 },
    oldMember: { type: Boolean, default: false }
})

const crypto = require('crypto')
const User = mongoose.model('User', userSchema)

User.findOne({ id: cfg.admin.id })
    .then((r) => {
        if (!r) return User.create( cfg.admin )
        return Promise.resolve(r)
    })
    .then((r) => {
        if(r.password !== cfg.admin.password) return Promise.resolve(null)
        console.log(`admin:${r.id} created`)
        const password = crypto.scryptSync(r.password, r._id.toString(), 64, { N: 1024 }).toString('hex')
        return User.updateOne({ _id: r._id }, { $set: { password } })

    })
    .then(r => {
        if (r) console.log('password changed!')
    })
    .catch((e) => {
        console.error(e.message)
    })

module.exports = User
