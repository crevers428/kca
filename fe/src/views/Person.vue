<template>
<v-container class="person" style="max-width: 1600px">
    <v-row v-if="info">
        <v-col>
            <div class="display-1 pa-5">{{ info.name }}</div>
        </v-col>
    </v-row>
    <v-row v-if="ranking.single.length > 0">
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
                            <tr v-for="rank in ranked" :key="rank.single.event">
                                <td style="white-space: nowrap;" class="text-left">{{ ofcText[rank.single.event] }}</td>
                                <td class="text-center">{{ rank.single.rank }}</td>
                                <td class="text-right">{{ $_recordToText(rank.single.record) }}</td>
                                <td class="text-center">{{ (rank.mean != undefined) ? rank.mean.rank : '' }}</td>
                                <td class="text-right">{{ (rank.mean != undefined) ? $_recordToText(rank.mean.record) : ''}}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
        </v-col>
    </v-row>
    <v-row v-for="(h, g) in arrangedHistory" :key="g">
        <v-col cols=12 class="mb-0 pb-0">
            <div class="title">{{ ofcText[h[0].event] }}</div>
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
                            <tr v-for="(r, i) in h" :key="i">
                                <td style="white-space: nowrap">
                                    <router-link
                                        v-if="i == 0 || h[i - 1].compName != r.compName"
                                        :to="`/comp/${r.compId}/results/${r.event}`"
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
                                    {{ $_recordToText(r.best) }}
                                </td>
                                <td class="text-right" style="position: relative;">
                                    <span
                                        v-if="r.pbMean || r.nrMean"
                                        style="position: absolute; top: 1px; right: 1px; font-size: 0.6rem;"
                                        :style="`color: ${(r.nrMean) ? '#E64A19' : '#0277BD'};`"
                                    >
                                        {{ (r.nrMean) ? 'NR' : 'PB' }}
                                    </span>
                                    {{ $_recordToText(r.mean) }}
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
import { recordTrans } from '../components/record/mixin.js'
import ofcEvents from '../forms/events.js'
export default {
    mixins: [pop, recordTrans],
    data: function () {
        return {
            ofc: ofcEvents.eventsArr,
            ofcText: ofcEvents.events,
            ready: false,
            info: false,
            ranking: {
                single: [],
                mean: []
            },
            history : []
        }
    },
    computed: {
        ranked() {
            const dids = [
            ]

            if(this.ready) {
                this.ofc.forEach(e => {
                    const indexS = this.ranking.single.findIndex(i => e.value == i.event)
                    const indexM = this.ranking.mean.findIndex(i => e.value == i.event)

                    if(indexS >= 0) {
                        const did = {
                            single: this.ranking.single[indexS],
                            mean: (indexM >= 0) ? this.ranking.mean[indexM] : null
                        }
                        dids.push(did)
                    }
                })
            }

            return dids
        },
        arrangedHistory() {
            const arranged = []

            if(this.ready) {
                this.ofc.forEach(e => {
                    if(this.history[e.value] != undefined) {
                        arranged.push(this.history[e.value])
                    }
                })
            }

            return arranged
        }
    },
    methods: {
        async setPerson () {
            const id = this.$route.params.id

            await Promise.all([
                this.$axios.get(`person/${id}`)
                    .then(r => {
                        if(!r.data.person) return this.$router.push('/404')
                        this.info = r.data.person
                    })
                    .catch(e => {
                        this.$_error(e.message)
                    }),
                this.$axios.get(`ranking/person/${id}`)
                    .then(r => {
                        this.ranking.mean = r.data.mean
                        this.ranking.single = r.data.single
                    })
                    .catch(e => {
                        this.$_error(e.message)
                    }),
                    this.$axios.get(`records/person/${id}`)
                        .then(r => {
                            this.history = r.data.history
                        })
                        .catch(e => {
                            this.$_error(e.message)
                        })
            ])

            this.ready = true
        }
    },
    mounted () {
        this.setPerson()
    }
}
</script>
