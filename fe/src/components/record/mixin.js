export const recordTrans = {
    methods: {
        $_inputToRecord (input) {
            let record = 0
            if(input == '') {
                record = null
            }
            else if(input == 'd') {
                record = 0
            }
            else if(input == 's'){
                record = -1
            }
            else {
                let num = Number(input)

                record += parseInt(num / 1000000) * 3600000
                num = num % 1000000
                record += parseInt(num / 100000) * 600000
                num = num % 100000
                record += parseInt(num / 10000) * 60000 // 1:00.00
                num = num % 10000
                record += parseInt(num / 1000) * 10000 // 10.00
                num = num % 1000
                record += parseInt(num / 100) * 1000 // 1.00
                num = num % 100
                record += parseInt(num / 10) * 100 // 0.10
                num = num % 10
                record += num * 10 // 0.01
            }

            return record
        },
        $_recordToInput (record) {
            let input = 0
            if(record == undefined || record == null) input = ''
            else if(record === -1) input = 's'
            else if(record === 0) input = 'd'
            else {
                input += Math.floor(record / 3600000) * 1000000
                record = record % 3600000
                input += parseInt(record / 600000) * 100000
                record = record % 600000
                input += parseInt(record / 60000) * 10000
                record = record % 60000
                input += parseInt(record / 10000) * 1000
                record = record % 10000
                input += parseInt(record / 1000) * 100
                record = record % 1000
                input += parseInt(record / 100) * 10
                record = record % 100
                input += parseInt(record / 10)
            }

            return new String(input)
        },
        $_recordToText (time) {
            if(time === -1) return 'DNS'
            else if(time === 0) return 'DNF'
            else if(time == null) return ''
            else {
                const hour = Math.floor(time / 3600000)
                time = time % 3600000
                const min = parseInt(time / 60000)
                time = time % 60000
                const sec = parseInt(time / 1000)
                time = time % 1000
                const mil = parseInt(time / 10)

                let text = ''
                if(hour > 0) {
                    text = String(hour) + ":"
                    if(min < 10) text = text + "0"
                }
                if(min > 0) {
                    text = String(min) + ":"
                    if(sec < 10) text = text + "0"
                }
                text = text + String(sec) + "."
                if(mil < 10) text = text + "0"
                text = text + String(mil)

                return text
            }
        }
    }
}
