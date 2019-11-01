<template>
    <v-container>
        <calendar
            is-inline
            ref="calendar"
        >
        </calendar>
        <date-picker
            is-inline
            ref="calendar2"
            v-model="date"
            do-adjust-page-range=true
        >

        </date-picker>
    </v-container>
</template>
<script>
import Calendar from 'v-calendar/lib/components/calendar.umd'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
export default {
    components: { Calendar, DatePicker },
    data: function () {
        return {
            date: new Date(2018, 0, 25),
            month: 0,
            page: {
                position: 2
            }
        }
    },
    computed: {
    },
    mounted () {
        const calendar = this.$refs.calendar
        const calendar2 = this.$refs.calendar2
        console.log(calendar2)
        console.log(calendar)
        let month = 0
        setInterval(() => {
            month++
            calendar.showPageRange(new Date(2018, month, 1))
            this.date = new Date(2019, month, 1)
        }, 1000)
    }
}
</script>
