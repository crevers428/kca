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
                label="이름"
                placeholder="한글 (2~20자)"
                :rules="rules.name"
            >
            </v-text-field>
        </v-row>
        <v-row>
            <v-text-field
                v-model="form.division"
                label="소속"
                placeholder="한글"
            >
            </v-text-field>
        </v-row>
        <v-row>
            <v-text-field
                v-model="form.email"
                label="이메일"
                :rules="rules.email"
            >
            </v-text-field>
        </v-row>
        <v-row>
            <div style="font-size: 0.8rem; color:#555555;" class="mb-2">생년월일</div>
            <!-- <date-picker
                is-inline
                is-expanded
                locale="ko"
                :max-date="$moment().subtract(1, 'days')._d"
                v-model="form.birthday"
                ref="datepicker"
                @input="dateChange"
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
            <event-picker
                v-model="form.events"
                :availableEvents="availableEvents"
            ></event-picker>
        </v-row>
    </v-form>
</v-container>
</template>
<script>
// Picker
// import DatePicker from 'v-calendar/lib/components/date-picker.umd'
import EventPicker from '../comp/eventPicker.vue'

export default {
    components: {
        // DatePicker,
        EventPicker
    },
    props: {
        person: { type: Object },
        availableEvents: { type: Array, defulat: () => { return [] } }
    },
    data: function () { return {
        valid: true,
        lazy: false,
        // form data
        rules: {
            name: [
                v => !!v || '이름을 입력하세요!',
                v => /^[가-힣]{2,20}$/.test(v) || '올바른 이름이 아닙니다.'
            ],
            email: [
                v => !!v || '이메일을 입력하세요!',
                v => /.+@.+\..+/.test(v) || '올바른 이메일이 아닙니다.'
            ],
        },
        form: {
            name: '',
            division: '',
            birthday: this.$moment().subtract(1, 'days')._d,
            events: []
        }
    }},
    methods: {
        reset () {
            this.$refs.form.reset()
        },
        sync () {
            if(this.person && this.person.name) {
                this.form.name = this.person.name
                this.form.division = this.person.division
                this.form.email = this.person.email
                this.form.birthday = this.$moment(this.person.birthday)._d
                this.form.events = this.person.events
            } else {
                this.reset()
            }
        },
        validate () {
            if(!this.$refs.form.validate()) return false
            if(!this.form.birthday) return false
            if(this.form.events.length == 0) return false

            return true
        },
        dateChange () {
            this.$refs.datepicker.adjustPageRange()
        }
    },
    mounted () {
        this.sync()
    },
    watch: {
        person: {
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
