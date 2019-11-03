<template>
<v-container height="100%">
    <v-navigation-drawer
        app
        clipped-left
        v-model="drawer"
        left
        :temporary="($vuetify.breakpoint.smAndDown) ? true : false"
        :permanent="($vuetify.breakpoint.smAndDown) ? false : true"
    >
        <v-row class="ma-0 pa-2" justify="center">
            옵션
        </v-row>
        <v-divider></v-divider>
        <v-row class="ma-0 pa-0 mt-2">
            <v-col class="ma-0 pa-0">
                <v-btn
                    tile large block
                    :color="(limit == 100) ? '#BBDEFB' : 'white'"
                    elevation=0
                    @click="changeLimit(100)"
                >
                    100위
                </v-btn>
            </v-col>
            <v-col class="ma-0 pa-0">
                <v-btn
                    tile large block
                    :color="(limit == 1000) ? '#BBDEFB' : 'white'"
                    elevation=0
                    @click="changeLimit(1000)"
                >
                    1000위
                </v-btn>
            </v-col>
        </v-row>
        <v-row class="ma-0 pa-0 mb-2">
            <v-col class="ma-0 pa-0">
                <v-btn
                    tile large block
                    :color="(type == 'single') ? '#BBDEFB' : 'white'"
                    @click="changeType('single')"
                    elevation="0"
                >
                    싱글
                </v-btn>
            </v-col>
            <v-col class="ma-0 pa-0">
                <v-btn
                    tile large block
                    :color="(type == 'mean') ? '#BBDEFB' : 'white'"
                    @click="changeType('mean')"
                    elevation="0"
                >
                    평균
                </v-btn>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="ma-0 pa-2" justify="center">
            종목
        </v-row>
        <v-divider></v-divider>
        <v-row class="ma-0 pa-0" style="max-height: 50%; overflow: auto;">
            <v-list style="width: 100%;">
                <v-list-item
                    v-for="(ofc, i) in ofcEvents"
                    :key="i"
                    :style="`background: ${(ofc.value == ev) ? '#BBDEFB' : 'transparent'};`"
                    style="cursor: pointer;"
                    @click="changeEv(ofc.value)"
                >
                    <v-list-item-title>
                        {{ofc.text}}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-row>
    </v-navigation-drawer>
    <v-row justify="center">
        <v-col align="center">
            <div class="title">{{ofcEventsText[ev]}} {{(type == 'single') ? '싱글' : '평균'}}</div>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-card outlined>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-center" style="width: 3.5rem; white-space: nowrap;">순위</th>
                                <th class="text-center" style="width: 7rem; white-space: nowrap;">이름</th>
                                <th class="text-center" style="width: 5rem; white-space: nowrap;">기록</th>
                                <th class="text-center" style="min-width: 10rem; white-space: nowrap;">대회</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody v-if="ready">
                            <tr v-for="(r, i) in ranking" :key="i">
                                <td class="text-right">{{ r.rank }}</td>
                                <td class="text-center" style="white-space: nowrap;">
                                    <router-link
                                        :to="`/person/${r.personId}`"
                                        class="none_underline"
                                        style=" white-space: nowrap;"
                                    >
                                        {{ r.personName }}
                                    </router-link>
                                </td>
                                <td class="text-right" style=" white-space: nowrap;">{{ timeReg(r.record) }}</td>
                                <td>
                                    <router-link
                                        :to="`comp/${r.compId}/results/${ev}`"
                                        class="none_underline"
                                        style=" white-space: nowrap;"
                                    >
                                        {{ r.compName }}
                                    </router-link>
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan=5 class="text-center pt-10 pb-10">
                                    <v-progress-circular
                                        :size="70"
                                        :width="7"
                                        color="grey"
                                        indeterminate
                                    ></v-progress-circular>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
        </v-col>
    </v-row>
    <v-btn
        v-show="$vuetify.breakpoint.smAndDown"
        color="indigo" fab large dark
        style="position: fixed; bottom: 1rem; right: 1rem;"
        @click="drawer = !drawer"
    >
        <v-icon>subject</v-icon>
    </v-btn>
</v-container>
</template>
<style>
.none_underline a, .none_underline {
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
            ready: false,
            drawer: false,
            ofcEvents: ofcEvents.eventsArr,
            ofcEventsText: ofcEvents.events,
            ranking: [],
            ev: '333',
            type: 'single',
            limit: 100,
            division: 'all',
            divisions: [
                { text: '전체', value: 'all'}
            ],
            limits: [
                { text: '100위', value: 100 },
                { text: '1000위', value: 1000 }
            ]
        }
    },
    methods: {
        changeEv (ev) {
            this.ev = ev
            this.setRanking()
        },
        changeType (type) {
            this.type = type
            this.setRanking()
        },
        changeLimit (limit) {
            this.limit = limit
            this.setRanking()
        },
        setRanking () {
            this.ready = false
            return this.$axios.get(`/ranking/${this.type}/${this.ev}/${this.limit}`)
                .then(r => {
                    this.ranking = r.data.ranking
                    this.ready = true
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
        this.setRanking()
    }
}
</script>
