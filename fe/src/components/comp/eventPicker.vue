<template>
<v-container class="ma-0 pa-0">
<v-row class="ma-0 pa-0 mb-3">
    <v-col
        cols=6 sm=6 md=3
        class="ma-0 pa-0"
    >
        <v-hover v-slot:default="{ hover }">
            <v-chip
                label
                style="width:100%; cursor: pointer; border:1px solid #1E88E5; font-weight:bold;"
                :color="hover ? '#BBDEFB' : 'grey'"
                text-color="grey"
                :outlined="hover ? false : true"
                class="ma-0 pa-5"
                @click="allCheck"
            >
                모두 선택
            </v-chip>
        </v-hover>
    </v-col>
    <v-col
        cols=6 sm=6 md=3
        class="ma-0 pa-0"
    >
        <v-hover v-slot:default="{ hover }">
            <v-chip
                label
                style="width:100%; cursor: pointer; border:1px solid #1E88E5; font-weight:bold;"
                :color="hover ? '#BBDEFB' : 'grey'"
                text-color="grey"
                :outlined="hover ? false : true"
                class="ma-0 pa-5"
                @click="allX"
            >
                모두 취소
            </v-chip>
        </v-hover>
    </v-col>
</v-row>
<v-row class="ma-0 pa-0">
    <v-col
        cols=6 sm=6 md=3
        class="ma-0 pa-0"
        v-for="(ev, i) in ofcEvents"
        :key="i"
        v-show="ev.show"
    >
        <v-hover v-slot:default="{ hover }">
            <v-chip
                label
                style="width:100%; cursor: pointer; border:1px solid #1E88E5; font-weight:bold;"
                :color="ev.chk || hover ? '#BBDEFB' : 'grey'"
                :text-color="ev.chk ? '#1E88E5' : 'grey'"
                :dark="ev.chk ? true : false"
                :outlined="ev.chk || hover ? false : true"
                class="ma-0 pa-5"
                @click="checkEv(ev)"
            >
                {{ev.text}}
            </v-chip>
        </v-hover>
    </v-col>
</v-row>
</v-container>
</template>
<script>
export default {
    props: {
        value: { type: Array },
        availableEvents: { type: Array, default: function () { return [] } },
    },
    data: function () { return {
        all: true,
        ofcEvents: {
            '333': { text: '3x3x3', value: '333', chk: false, show: true },
            '222': { text: '2x2x2', value: '333', chk: false, show: true },
            '444': { text: '4x4x4', value: '333', chk: false, show: true },
            '555': { text: '5x5x5', value: '333', chk: false, show: true },
            '666': { text: '6x6x6', value: '333', chk: false, show: true },
            '777': { text: '7x7x7', value: '333', chk: false, show: true },
            '333bf': { text: '3x3x3 눈 가리기', value: '333', chk: false, show: true },
            '333oh': { text: '3x3x3 한 손', value: '333', chk: false, show: true },
            '333fmc': { text: '3x3x3 최소회전', value: '333', chk: false, show: true },
            '333ft': { text: '3x3x3 발', value: '333', chk: false, show: true },
            'pyram': { text: '피라밍크스', value: '333', chk: false, show: true },
            'minx': { text: '메가밍크스', value: '333', chk: false, show: true },
            'clock': { text: '루빅스클락', value: '333', chk: false, show: true },
            'skewb': { text: '스큐브', value: '333', chk: false, show: true },
            'sq1': { text: '스퀘어-1', value: '333', chk: false, show: true },
            '444bf': { text: '4x4x4 눈 가리기', value: '333', chk: false, show: true },
            '555bf': { text: '5x5x5 눈 가리기', value: '333', chk: false, show: true },
            '333mbf': { text: '3x3x3 복수 눈 가리기', value: '333', chk: false, show: true }
        },
        data: this.value
    }},
    methods: {
        checkEv (ev) {
            ev.chk = !ev.chk
            this.setData()

        },
        allCheck () {
            for(const ev in this.ofcEvents) {
                this.ofcEvents[ev].chk = true
            }
            this.setData()
        },
        allX () {
            for(const ev in this.ofcEvents) {
                this.ofcEvents[ev].chk = false
            }
            this.setData()
        },
        setData () {
            this.data = []
            for(const ev in this.ofcEvents) {
                if(this.ofcEvents[ev].chk && this.ofcEvents[ev].show) this.data.push(ev)
            }
            this.$emit('input', this.data)
        }
    },
    mounted () {
        this.value.forEach((ev) => {
            this.ofcEvents[ev].chk = true
        })

        if(this.availableEvents.length > 0) {
            for(const ev in this.ofcEvents) {
                if(this.availableEvents.indexOf(ev) < 0) {
                    this.ofcEvents[ev].show = false
                }
                else {
                    this.ofcEvents[ev].show = true
                }
            }
        }
    },
    watch: {
        value (val) {
            for(const ev in this.ofcEvents) {
                if(val.indexOf(ev) < 0) {
                    this.ofcEvents[ev].chk = false
                }
                else {
                    this.ofcEvents[ev].chk = true
                }
            }
        },
        availableEvents (val) {
            if(val && val.length > 0) {
                for(const ev in this.ofcEvents) {
                    if(val.indexOf(ev) < 0) {
                        this.ofcEvents[ev].show = false
                    }
                    else {
                        this.ofcEvents[ev].show = true
                    }
                }
            }
        }
    }
}
</script>
