var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const jwt = require('jsonwebtoken')
const cfg = require('../../../config')
const moment = require('moment')

const User = require('../../models/users')

const verifyToken = (t) => {
    return new Promise((resolve, reject) => {
        if (!t) resolve({ id: '_guest', lv:3 }) // no token means guest
        if ((typeof t) !== 'string') reject(new Error('invalid token'))
        if (t.length < 10) resolve({ id: '_guest', lv:3 }) // invalid token?
        // not for guest
        jwt.verify(t, cfg.jwt.secretKey, (err, v) => {
            if(err) { // unverified token
                reject(err)
            }
            resolve(v)
        })
    })
}

const signToken = (id, exp) => {
    return new Promise((resolve, reject) => {
        const o = {
            issuer: cfg.jwt.issuer,
            // subject: cfg.jwt.subject
            expiresIn: exp,
            algorithm: cfg.jwt.algorithm
        }
        if (rmb) o.expiresIn = cfg.jwt.expiresInRemember
        jwt.sign({ id, rmb }, cfg.jwt.secretKey, o, (err, token) => {
            if(err) reject(err)
            resolve(token)
        })
    })
}

const getToken = async(t) => {
    let vt = await verifyToken(t)
    if(vt.id === '_guest') return { user: vt, token: null} // if guest, do not need token
    const diff = moment(vt.exp * 1000).diff(moment(), 'seconds') // have enough time to refresh
    //console.log(diff)
    if(diff > (vt.exp - vt.iat) / cfg.jwt.expiresInDiv) return { user: vt, token: null }
    const exp = (vt.exp - vt.iat)
    const nt = await signToken(vt.id, vt.exp)
    vt = await verifyToken(nt) // 바뀐 토큰으로 user 정보를 업데이트..?
    return { user: vt, token: nt}
}

router.all('*', function(req, res, next) {
    res.header('Access-Control-Expose-Headers', 'token')
    getToken(req.headers.authorization)
        .then((gt) => {
            // if got a new token send that, but not, just null
            res.set('token', gt.token)
            // got user information
            if(gt.user.id !== '_guest') return User.findOne({ id: gt.user.id })
            return gt.user // guest
        })
        .then((u) => {
            if(!u) throw new Error('User not found')
            req.user = u
            next()
        })
        .catch((e) => {
            let expired = false
            if(e.name == 'TokenExpiredError') {
                expired = true
                e.message = 'Session expired'
            }
            res.send({ success: false, msg: e.message, expired })
        })
})

router.use('/sign', require('./sign'))
router.use('/competition', require('./competition'))
router.use('/records', require('./records'))
router.use('/ranking', require('./ranking'))
router.use('/person', require('./person'))

router.use('/page', require('./page'))

router.all('*', function(req, res, next){
    if(req.user.lv > 2) return next(createError(404))
    next()
})

router.use('/manage', require('./manage'))

router.all('*', function(req, res, next) {
    next(createError(404));
});

module.exports = router;
