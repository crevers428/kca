const Competition =  require('../models/competitions')
const Record =  require('../models/records')
const Registration = require('../models/registrations')
const moment = require('moment')

validator = {
    name : val => {
        return new Promise(async function(resolve, reject) {
            if(val == undefined) return reject(new Error("Missing value : name"))
            if(!Competition.schema.obj.name.match.test(val)) return reject(new Error("Invalid Value : name"))
            if(val == 'register') return reject(new Error("nvalid Value : name"))
            resolve(val)
        })
    },
    date : val => {
        return new Promise(function(resolve, reject) {
            if(val == undefined) return reject(new Error("Missing value : date"))
            if(!val.start || !val.end) return reject(new Error("Invalid Value : date.type.obj"))
            const diff = moment(val.start).diff(val.end)
            if(diff == undefined) return reject(new Error("Invalid Value : date.type.format"))
            if(diff > 0) return reject(new Error("Invalid Value : date.diff"))
            resolve(val)
        })
    },
    events: val => {
        return new Promise(function(resolve, reject) {
            if(val == undefined) return reject(new Error("Missing value : events"))
            if(Object.prototype.toString.call(val) != '[object Array]') return reject(new Error("Invalid Value : events.type"))
            if(val.length <= 0) return reject(new Error("Invalid Value : events.empty"))
            const ofcEvs = Record.schema.obj.event.enum
            // check the value in the array is correct
            val.forEach((ev) => {
                if(ofcEvs.indexOf(ev) < 0) return reject(new Error("Invalid Value : events." + ev))
            })
            // sorting evs
            const newVal = []
            ofcEvs.forEach(ev => {
                if(val.indexOf(ev) >= 0) newVal.push(ev)
            })
            resolve(newVal)
        })
    },
    makeId: name => {
        return name.replace(/\s/gi, "")
    }
}
module.exports = validator;
