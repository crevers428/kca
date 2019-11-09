<template>
<v-container class="person" style="max-width: 1600px">
    <v-row v-if="info">
        <v-col>
            <div class="display-1 pa-5">{{ info.name }}</div>
        </v-col>
    </v-row>
    <v-row v-if="ranking">
        <v-col cols=12 class="mb-0 pb-0">
            <div class="title">랭킹</div>
        </v-col>
        <v-col>
            <v-card outlined>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-center" style="width: 7rem; white-space: nowrap;">종목</th>
                                <th class="text-center" style="width: 3rem; white-space: nowrap;">싱글 순위</th>
                                <th class="text-center" style="width: 5rem; white-space: nowrap;">싱글 기록</th>
                                <th class="text-center" style="width: 3rem; white-space: nowrap;">평균 순위</th>
                                <th class="text-center" style="width: 5rem; white-space: nowrap;">평균 기록</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="ev in ofc" :key="ev.value" v-if="ranking.single.findIndex(i => i.event == ev.value) >= 0">
                                <td style="white-space: nowrap;" class="text-left">{{ ev.text }}</td>
                                <td class="text-center">{{ ranking.single[ranking.single.findIndex(i => i.event == ev.value)].rank }}</td>
                                <td class="text-right">{{ timeReg(ranking.single[ranking.single.findIndex(i => i.event == ev.value)].record) }}</td>
                                <td class="text-center">
                                    <span v-if="ranking.mean.findIndex(i => i.event == ev.value) >= 0">
                                        {{ ranking.mean[ranking.mean.findIndex(i => i.event == ev.value)].rank }}
                                    </span>
                                </td>
                                <td class="text-right">
                                    <span v-if="ranking.mean.findIndex(i => i.event == ev.value) >= 0">
                                        {{ timeReg(ranking.mean[ranking.mean.findIndex(i => i.event == ev.value)].record) }}
                                    </span>
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
        </v-col>
    </v-row>
    <v-row v-for="ev in ofc" v-if="history[ev.value] != undefined">
        <v-col cols=12 class="mb-0 pb-0">
            <div class="title">{{ ev.text }}</div>
        </v-col>
        <v-col>
            <v-card outlined>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-center" style="width: 7rem; white-space: nowrap;">대회</th>
                                <th class="text-center" style="width: 3rem; white-space: nowrap;">라운드</th>
                                <th class="text-center" style="width: 3rem; white-space: nowrap;">순위</th>
                                <th class="text-center" style="width: 3rem; white-space: nowrap;">싱글 기록</th>
                                <th class="text-center" style="width: 5rem; white-space: nowrap;">평균 기록</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(r, i) in history[ev.value]" :key="i" @click="$router.push(`/record/${r._id}`)">
                                <td style="white-space: nowrap">
                                    <router-link
                                        v-if="i == 0 || history[ev.value][i - 1].compName != r.compName"
                                        :to="`/comp/${r.compId}/results/${ev.value}`"
                                    >
                                        {{ r.compName }}
                                    </router-link>
                                </td>
                                <td class="text-center">{{ r.round }}</td>
                                <td class="text-center">{{ r.place }}</td>
                                <td class="text-right" style="position: relative;">
                                    <span
                                        v-if="r.pbSingle || r.nrSingle"
                                        style="position: absolute; top: 1px; right: 1px; font-size: 0.6rem;"
                                        :style="`color: ${(r.nrSingle) ? '#E64A19' : '#0277BD'};`"
                                    >
                                        {{ (r.nrSingle) ? 'NR' : 'PB' }}
                                    </span>
                                    {{ timeReg(r.best) }}
                                </td>
                                <td class="text-right" style="position: relative;">
                                    <span
                                        v-if="r.pbMean || r.nrMean"
                                        style="position: absolute; top: 1px; right: 1px; font-size: 0.6rem;"
                                        :style="`color: ${(r.nrMean) ? '#E64A19' : '#0277BD'};`"
                                    >
                                        {{ (r.nrMean) ? 'NR' : 'PB' }}
                                    </span>
                                    {{ timeReg(r.mean) }}
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>
<style>
.person a {
    text-decoration: none;
}
</style>
<script>
import { pop } from '../mixins/global/pop.js'
import ofcEvents from '../forms/events.js'
export default {
    mixins: [pop],
    data: function () {
        return {
            ofc: ofcEvents.eventsArr,
            ready: false,
            info: false,
            ranking: false,
            history : []
        }
    },
    methods: {
        setPerson () {
            const id = this.$route.params.id

            this.$axios.get(`person/${id}`)
                .then(r => {
                    if(!r.data.person) return this.$router.push('/404')
                    this.info = r.data.person
                })
                .catch(e => {
                    this.$_error(e.message)
                })

            this.$axios.get(`ranking/person/${id}`)
                .then(r => {
                    this.ranking = {}
                    this.ranking.mean = r.data.mean
                    this.ranking.single = r.data.single
                })
                .catch(e => {
                    this.$_error(e.message)
                })

            this.$axios.get(`records/person/${id}`)
                .then(r => {
                    this.history = r.data.history
                })
                .catch(e => {
                    this.$_error(e.message)
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
        this.setPerson()
    }
}
</script>
