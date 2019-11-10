module.exports = {
    checkDnf: function(detail) {
        const notDnf = []
        detail.forEach(r => {
            if( r > 0 ) {
                notDnf.push(r)
            }
        })

        return notDnf
    },
    getBest: function(detail) {
        const notDnf = this.checkDnf(detail)
        notDnf.sort((a, b) => a - b)

        if(notDnf.length == 0) {
            return 0
        }
        return notDnf[0]
    },
    getWorst: function(detail) {

    },
    getMean: function(detail) {
        if(detail.length > 3) {
            return this.getAvg(detail)
        }
        else {
            return this.getMo3(detail)
        }
    },
    getMo3: function(detail) {
        const notDnf = this.checkDnf(detail)
        if(notDnf.length < 3) return 0

        const sum = notDnf.reduce((a, c) => a + c)
        const mean = Math.round(sum / 30) * 10

        return mean
    },
    getAvg: function(detail) {
        const notDnf = this.checkDnf(detail)
        if(notDnf.length < 4) return 0

        notDnf.sort((a, b) => a - b)
        if(notDnf.length == 5) {
            notDnf.pop()
        }
        notDnf.shift()
        const mean = this.getMo3(notDnf)

        return mean
    },

    checkMean: function (ev, type) {
        const mean3 = ['666', '777', '333bf', '333fmc', '444bf', '555bf']
        const mean5 = ['222', '333', '444', '555', '666', '777', '333bf',
                        '333oh', '333fmc' ,'333ft', 'minx', 'pyram', 'sq1',
                        'skewb', 'clock', '332', '223', 'ivy', '222br', '333br',
                        '444br', 'pyrambr', 'skewbbr', 'mirror', 'mirrorbr', 'gear']
        if((type == 'a' && mean5.indexOf(ev) >= 0) || ((type =='m' || type == '3') && mean3.indexOf(ev) >= 0)) {
            return true
        }
        else {
            return false
        }
    }
}
