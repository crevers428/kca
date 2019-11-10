<template>
<v-container>
    <v-row justify="center">
        <v-col align="center">
            <div style="font-size: 2rem;">역대 기록</div>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-card
                outlined
            >
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-center" style="width: 3.5rem; white-space: nowrap;">날짜</th>
                                <th class="text-center" style="width: 7rem; white-space: nowrap;">이름</th>
                                <th class="text-center" style="width: 5rem; white-space: nowrap;">기록</th>
                                <th class="text-center" style="width: 10rem; white-space: nowrap;">대회</th>
                                <th v-if="type == 'mean'" class="text-center" style="width: 10rem; white-space: nowrap;">기록 상세</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody v-if="ready">
                            <tr v-for="(r, i) in history" :key="i">
                                <td class="text-right" style="white-space: nowrap;">{{ $moment(r.date).format("ll")}}</td>
                                <td class="text-center" style="white-space: nowrap;">
                                    <router-link
                                        :to="`/person/${r.personId}`"
                                        class="none_underline"
                                    >
                                        {{ r.personName }}
                                    </router-link>
                                </td>
                                <td class="text-right">{{ (type == 'single') ? $_recordToText(r.best) : $_recordToText(r.mean) }}</td>
                                <td style="white-space: nowrap;">
                                    <router-link
                                        :to="`/comp/${r.compId}/results/${ev}`"
                                        class="none_underline"
                                    >
                                        {{ r.compName }}
                                    </router-link>
                                </td>
                                <td v-if="type == 'mean'" style="white-space: nowrap;">
                                    <div v-for="(d, j) in r.detail" style="display: inline-block; width: 3rem;" class="text-right" :key="j">
                                        {{ $_recordToText(d) }}
                                    </div>
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
            ev: (this.$route.params.event) ? this.$route.params.event : '333',
            type: (this.$route.params.type) ? this.$route.params.type : 'single',
            history: []
        }
    },
    methods: {
        navDrawer() {
            this.$EventBus.$emit('navHistoryDrawer')
        },
        setHistory() {
            this.ready = false
            this.$axios.get(`records/history/${this.ev}/${this.type}`)
                .then( r => {
                    this.history = r.data.r
                    this.ready = true
                })
                .catch( e => {
                    this.$_error(e.message)
                })
        }
    },
    mounted() {
        if(this.ev != undefined && this.ofcEventsText[this.ev] == undefined) {
            this.$router.push('/404')
        }

        if(this.type != 'single' && this.type != 'mean') {
            this.$router.push('/404')
        }

        this.$EventBus.$emit('historyOptInit', { ev: this.ev, type: this.type })

        this.$EventBus.$on('historyEv', ev => {
            this.ev = ev
            this.$router.push(`/history/${this.ev}/${this.type}`).catch(() => {})
            this.setHistory()
        })
        this.$EventBus.$on('historyType', type => {
            this.type = type
            this.$router.push(`/history/${this.ev}/${this.type}`).catch(( )=> {})
            this.setHistory()
        })

        this.setHistory()
    }
}
</script>
