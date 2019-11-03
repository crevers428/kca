<template>
<v-card outlined class="pa-3">
    <v-simple-table>
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-center" style="white-space: nowrap; width: 3rem;">순위</th>
                    <th class="text-center" style="white-space: nowrap; width: 3rem;">이름</th>
                    <th style="width: 1rem;"></th>
                    <th class="text-right" style="white-space: nowrap; width: 5rem;">최고 기록</th>
                    <th class="text-right" style="white-space: nowrap; width: 5rem;">평균 기록</th>
                    <th style="width: 1rem;"></th>
                    <th class="text-right" style="width: 5rem;">1회</th>
                    <th class="text-right" style="width: 5rem;">2회</th>
                    <th class="text-right" style="width: 5rem;" v-if="type == 'a' || type == '3' || type == 'm'">3회</th>
                    <th class="text-right" style="width: 5rem;" v-if="type == 'a'">4회</th>
                    <th class="text-right" style="width: 5rem;" v-if="type == 'a'">5회</th>
                    <th></th>
                </tr>
            </thead>
            <tbody v-if="records.length > 0">
                <tr v-for="(record, i) in records" :key="record._id">
                    <td class="text-right">{{ (i > 0 && records[i - 1].place == record.place) ? '' : record.place }}</td>
                    <td style="white-space: nowrap;">{{record.personName}}</td>
                    <td></td>
                    <td class="text-right" style="font-size: 0.8rem; position: relative;">
                        <span
                            v-if="record.nrSingle"
                            style="position: absolute; top: 1px; right: 1px; font-size: 0.6rem; color: #E64A19;"
                        >
                            NR
                        </span>
                        {{timeReg(record.best)}}
                    </td>
                    <td class="text-right" style="font-size: 0.8rem; position: relative;">
                        <span
                            v-if="record.nrMean"
                            style="position: absolute; top: 1px; right: 1px; font-size: 0.6rem; color: #E64A19;"
                        >
                            NR
                        </span>
                        {{timeReg(record.mean)}}
                    </td>
                    <td></td>
                    <td class="text-right" style="font-size: 0.8rem;">{{timeReg(record.detail[0])}}</td>
                    <td class="text-right" style="font-size: 0.8rem;">{{timeReg(record.detail[1])}}</td>
                    <td class="text-right" style="font-size: 0.8rem;" v-if="type == 'a' || type == '3' || type == 'm'">{{timeReg(record.detail[2])}}</td>
                    <td class="text-right" style="font-size: 0.8rem;" v-if="type == 'a'">{{timeReg(record.detail[3])}}</td>
                    <td class="text-right" style="font-size: 0.8rem;" v-if="type == 'a'">{{timeReg(record.detail[4])}}</td>
                    <td></td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>
</v-card>
</template>
<script>
export default {
    props: {
        compId: { type: String },
        event: { type: String },
        round: { type: Number },
        limit: { type: Number, default: 999 },
        type: { type: String, default: '2' },
        isFinal: { type: Boolean, default: false }
    },
    data: function () {
        return {
            records: []
        }
    },
    methods: {
        getResults() {
            return this.$axios.get(`records/${this.compId}/results/${this.event}/${this.round}/${this.limit}`)
                .then(r => {
                    this.records = r.data.records
                })
                .catch(e => {
                    console.error(e)
                })
        },
        timeReg(time) {
            if(time == -1) return 'DNS'
            else if(time == 0) return 'DNF'
            else {
                const min = parseInt(time / 60000)
                time = time % 60000
                const sec = parseInt(time / 1000)
                time = time % 1000
                const mil = parseInt(time / 10)

                let text = ''
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
    },
    mounted () {
        this.getResults(this.event, this.round)
    }
}
</script>
