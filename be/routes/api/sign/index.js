var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const jwt = require('jsonwebtoken')
const cfg = require('../../../../config')
const crypto = require('crypto')
const User = require('../../../models/users')

const signToken = (id, rmb) => {
    return new Promise((resolve, reject) => {
        const o = {
            issuer: cfg.jwt.issuer,
            // subject: cfg.jwt.subject
            expiresIn: cfg.jwt.expiresIn,
            algorithm: cfg.jwt.algorithm
        }
        if (rmb) o.expiresIn = cfg.jwt.expiresInRemember
        jwt.sign({ id, rmb }, cfg.jwt.secretKey, o, (err, token) => {
            if(err) reject(err)
            resolve(token)
        })
    })
}

router.post('/up', (req, res) => {
    const { id, name, email, birthday, password } = req.body
    const u = new User({ id, name, email, birthday, password })

    if(!u.id) return res.send({ success: false, msg: "incorrect information" })
    if(!u.name) return res.send({ success: false, msg: "incorrect information" })
    if(!u.email) return res.send({ success: false, msg: "incorrect information" })
    if(!u.birthday) return res.send({ success: false, msg: "incorrect information" })
    if(!u.password) return res.send({ success: false, msg: "incorrect information" })

    u.save()
        .then(r => {
            const cryPwd = crypto.scryptSync(password, r._id.toString(), 64, { N: 1024 }).toString('hex')
            return User.updateOne({ id: r.id }, { password: cryPwd })
        })
        .then(r => {
            res.send({ success: true })
        })
        .catch(e => {
            if(e.code === 11000) {
                const dupKey = Object.keys(e.keyPattern)[0]
                e.message = `Your ${dupKey} is already exists`
            }
            res.send({ success: false, msg: e.message })
        })
})

router.post('/in', (req, res) => {
    const { id, password, remember } = req.body
    if (!id) return res.send({ success: false, msg: 'empty id'})
    if (!password) return res.send({ success: false, msg: 'empty password'})
    if (remember === undefined) return res.send({ success: false, msg: 'how remember?'})

    User.findOne({ id })
        .then((r) => {
            if(!r) throw new Error('wrong login information')
            const p = crypto.scryptSync(password, r._id.toString(), 64, { N: 1024 }).toString('hex')
            if(r.password !== p ) throw Error('wrong login informatin!')
            return User.updateOne({ id }, { $inc: { inCnt: 1 } })
            // return signToken(r.id)
        })
        .then((ru) => {
            if(!ru) throw new Error('db error during inCnt update')
            return signToken(id, remember)
        })
        .then((r) => {
            res.send({ success: true, token: r})
        })
        .catch((e) => {
            console.log(e)
            res.send({ success: false, msg: e.message })
        })
})

router.post('/out', (req, res) => {
    res.send({ success: false, msg: 'not yet'})
})

router.all('*', function(req, res, next) {
    next(createError(404))
})

module.exports = router;
