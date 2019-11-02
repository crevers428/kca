<template>
<v-container class="pl-5 pt-0 pr-5">
    <v-form
        ref="form"
        :lazy-validation="lazy"
        v-model="valid"
    >
        <v-row>
            <v-text-field
                v-model="form.name"
                label="대회 이름"
                placeholder="6~50 자리의 한글, 영문, 숫자"
                :rules="rules.name"
            >
            </v-text-field>
        </v-row>
        <v-row>
            <div style="font-size: 0.8rem; color:#555555;" class="mb-2">날짜</div>
            <!-- <date-picker
                is-inline
                is-expanded
                locale="ko"
                mode="range"
                :min-date="$moment().add(1, 'days')._d"
                v-model="form.date"
                ref="datepicker"
            >
            </date-picker> -->
        </v-row>
        <v-row>
            <div
                style="width:100%; font-size: 0.8rem; color:#555555;"
                class="pa-0 pb-3 mt-5"
            >
                종목
            </div>
            <event-picker v-model="form.events"></event-picker>
        </v-row>
    </v-form>
</v-container>
</template>
<script>
// DATE Picker
//import DatePicker from 'v-calendar/lib/components/date-picker.umd'

import EventPicker from './eventPicker.vue'

import rules from '../../validations/competition.js'

export default {
    components: {
        //DatePicker,
        EventPicker
    },
    props: {
        comp: { type: Object }
    },
    data: function () { return {
        valid: true,
        lazy: false,
        // form data
        rules: rules,
        form: {
            name: '',
            date: {
                start: this.$moment().add(1, 'days')._d,
                end: this.$moment().add(1, 'days')._d
            },
            events: []
        }
    }},
    methods: {
        sync () {
            if(this.comp != undefined) {
                this.form.name = this.comp.name
                this.form.date.start = this.$moment(this.comp.date.start)._d
                this.form.date.end = this.$moment(this.comp.date.end)._d
                this.form.events = this.comp.events

                this.$refs.datepicker.adjustPageRange()
            }
        },
        validate () {
            if(!this.$refs.form.validate()) return false
            if(!this.form.date) return false
            if(this.form.events.length == 0) return false

            return true
        }
    },
    mounted () {
        if(this.comp && this.comp.name) this.sync()
    },
    watch: {
        comp: {
            handler () {
                this.sync()
            },
            deep: true
        },
        form: {
            handler () {
                if(this.validate()) return this.$emit('ok', this.form)
                this.$emit('no')
            },
            deep: true
        }
    }
}
</script>
