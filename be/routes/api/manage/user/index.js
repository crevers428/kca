var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const User = require('../../../../models/users');


router.get('/', function(req, res, next) {
    User.find().select('-password -_id')
        .then(r => {
            res.send({ success: true, users: r})
        })
        .catch(e => {
            res.send({ success: false })
        })
})

router.put('/:id', (req, res, next) => {
    const id = req.params.id
    if(!id) return res.send({ success: false, msg: 'need identification' })
    const { name, birthday, email, lv } = req.body
    User.findOne({ id })
        .then(r => {
            const set = {}
            if( name !== undefined ) set.name = name
            if( birthday !== undefined ) set.birthday = birthday
            if( email !== undefined ) set.email = email
            if( lv !== undefined ) {
                if(r.id == 'root' && lv != 0) {
                    throw new Error('root must have level 1')
                }
                set.lv = lv
            }
            if(req.user.lv > 0 && lv !== undefined) {
                if(r.lv !== lv) throw new Error('Permission denied')
            }
            return User.updateOne({ id }, { $set: set })
        })
        .then(ru => {
            res.send({ success: true, user: id })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.delete('/:id', (req, res, next) => {
    // need lv 0 permission to delete users
    if(req.user.lv > 0) return res.send({ success:false, msg: 'Permission denied' })

    const id = req.params.id
    User.findOne({ id: id })
        .then((r) => {
            if(!r) throw new Error('User Not Found')
            if(r.id === 'root') throw new Error('Cannot delete root')
            if(r.name === req.user.name) throw new Error('Cannot delete yourself')
            return User.deleteOne({ id })
        })
        .then(rd => {
            res.send({ success: true, user: id })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})


router.all('*', function(req, res, next) {
    next(createError(404));
});

module.exports = router;
