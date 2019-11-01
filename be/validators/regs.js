const Competition =  require('../models/competitions')
const Record =  require('../models/records')
const Registration = require('../models/registrations')
const Person = require('../models/people')
const moment = require('moment')

validator = {
    name: val => {
        return new Promise(function(resolve, reject) {
            if(val == undefined) return reject(new Error("Missing value : name"))
            if(!Person.schema.obj.name.match.test(val)) return reject(new Error("Invalid Value : name"))
            if(val == 'register') return reject(new Error("invalid Value : name"))
            resolve(val)
        })
    },
    email: val => {
        return new Promise(function(resolve, reject) {
            if(val == undefined) return reject(new Error("Missing value : email"))
            if(!/.+@.+\..+/.test(val)) return reject(new Error("Invalid value : email"))
            resolve(val)
        })
    },
    division: val => {
        return new Promise(function(resolve, reject) {
            if(val == undefined) return reject(new Error("Missing value : division"))
            resolve(val)
        })
    },
    birthday: val => {
        return new Promise(function(resolve, reject) {
            if(val == undefined) return reject(new Error("Missing value : birthday"))
            const diff = moment(val).diff(moment())
            if(diff == undefined) return reject(new Error("Invalid value : birthday.format"))
            if(diff > 0) return reject(new Error("Invalid value : birthday.diff"))
            resolve(val)
        })
    },
    events: (val, ofcEvs) => {
        return new Promise(async function(resolve, reject) {
            if(val == undefined) return reject(new Error("Missing value : events"))
            if(Object.prototype.toString.call(val) != '[object Array]') return reject(new Error("Invalid value : events.type"))
            if(val.length <= 0) return reject(new Error("Invalid value : events.empty"))

            if(ofcEvs == undefined) ofcEvs = Record.schema.obj.event.enum

            // check the value in the array is correct
            val.forEach((ev) => {
                if(ofcEvs.indexOf(ev) < 0) return reject(new Error("Invalid value : events." + ev))
            })
            // sorting evs
            const newVal = []
            ofcEvs.forEach(ev => {
                if(val.indexOf(ev) >= 0) newVal.push(ev)
            })
            resolve(newVal)
        })
    },
    deleted: val => {
        return new Promise(function(resolve, reject) {
            if(val == undefined) return reject(new Error("Missing value : deleted"))
            if(Registration.schema.obj.deleted.enum.indexOf(val) < 0) throw new Error("Invalid value : deleted")
            resolve(val)
        })
    },
    status: val => {
        return new Promise(function(resolve, reject) {
            if(val == undefined) return reject(new Error("Missing value : status"))
            if(Registration.schema.obj.status.enum.indexOf(val) < 0) throw new Error("Invalid value : status")
            resolve(val)
        })
    }
}
module.exports = validator;
