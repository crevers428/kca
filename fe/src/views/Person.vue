<template>
<v-container class="person" style="max-width: 1600px">
    <v-row v-if="info">
        <div class="pa-5">
            <div class="display-1">{{ info.name }}</div>
            <div class="pl-1 pt-2" style="font-size: 0.9rem; color: #757575;">{{ info.id }}</div>
        </div>
        <v-tabs hide-slider v-model="tab" show-arrows style="background: transparent;">
            <v-tab style="text-transform: initial;">
                랭킹
            </v-tab>
            <v-tab v-for="(h, g) in arrangedHistory" style="text-transform: initial;" :key="g">
                {{ ofcText[h[0].event]}}
            </v-tab>
        </v-tabs>
    </v-row>
    <v-divider></v-divider>
    <v-row>
        <v-col>
            <v-tabs-items v-model="tab" touchless class="pt-1">
                <v-tab-item>
                    <v-card outlined>
                        <v-simple-table v-if="ranking.single.length > 0">
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
                </v-tab-item>
                <v-tab-item v-for="(h, g) in arrangedHistory" :key="g">
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
                                        <th class="text-center" style="width: 5rem;">기록 상세</th>
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
                                        <td style="white-space: nowrap;" class="pl-10">
                                            <div
                                                v-for="(d, j) in r.detail"
                                                :key="j"
                                                style="display: inline-block; width: 4rem;"
                                                class="pl-3 pr-3 text-right"
                                            >
                                                {{ $_recordToText(d) }}
                                            </div>
                                        </td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
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
            tab: 0,
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
