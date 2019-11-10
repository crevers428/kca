<template>
<v-container height="100%">
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
                                <td class="text-right">{{ (i > 0 && ranking[i - 1].rank == r.rank) ? '' : r.rank }}</td>
                                <td class="text-center" style="white-space: nowrap;">
                                    <router-link
                                        :to="`/person/${r.personId}`"
                                        class="none_underline"
                                        style=" white-space: nowrap;"
                                    >
                                        {{ r.personName }}
                                    </router-link>
                                </td>
                                <td class="text-right" style=" white-space: nowrap;">{{ $_recordToText(r.record) }}</td>
                                <td>
                                    <router-link
                                        :to="`/comp/${r.compId}/results/${ev}`"
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
        @click="navDrawer"
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
import { recordTrans } from '../components/record/mixin.js'
import ofcEvents from '../forms/events.js'
export default {
    mixins: [pop, recordTrans],
    data: function () {
        return {
            ready: false,
            ofcEvents: ofcEvents.eventsArr,
            ofcEventsText: ofcEvents.events,
            ranking: [],
            ev: (this.$route.params.event) ? this.$route.params.event : '333',
            type: (this.$route.params.type) ? this.$route.params.type : 'single',
            limit: (this.$route.params.limit) ? this.$route.params.limit : 100,
            division: (this.$route.params.division) ? this.$route.params.division : 'all'
        }
    },
    methods: {
        navDrawer () {
            this.$EventBus.$emit('navRankingDrawer')
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
        }
    },
    mounted () {
        if(this.ev != undefined && this.ofcEventsText[this.ev] == undefined) {
            this.$router.push('/404')
        }

        if(this.type != 'single' && this.type != 'mean') {
            this.$router.push('/404')
        }

        if(this.limit != 100 && this.type != 1000) {
            this.$router.push('/404')
        }

        this.$EventBus.$emit('rankingOptInit', { ev: this.ev, type: this.type, limit: this.limit })

        this.$EventBus.$on('rankingEv', ev => {
            this.ev = ev
            this.$router.push(`/ranking/${this.ev}/${this.type}/${this.limit}`).catch(e => {})
            this.setRanking()
        })

        this.$EventBus.$on('rankingType', type => {
            this.type = type
            this.$router.push(`/ranking/${this.ev}/${this.type}/${this.limit}`).catch(e => {})
            this.setRanking()
        })

        this.$EventBus.$on('rankingLimit', limit => {
            this.limit = limit
            this.$router.push(`/ranking/${this.ev}/${this.type}/${this.limit}`).catch(e => {})
            this.setRanking()
        })

        this.setRanking()
    }
}
</script>
