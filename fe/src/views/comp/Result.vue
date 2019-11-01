<template>
<v-container v-if="ready">
    <div class="display-1 pl-5 pt-3">{{ofcEvents[this.$route.params.event]}}</div>
    <v-tabs
        hide-slider
        v-model="tabs"
        class="mt-4"
    >
        <v-tab v-for="round in event.rounds" :key="round.round" class="subtitle font-weight-bold">
            <span v-if="Number(round.round) == event.rounds.length">결승</span>
            <span v-else>라운드 {{round.round}}</span>
        </v-tab>
    </v-tabs>
    <v-tabs-items
        class="mt-4"
        v-model="tabs"
        touchless
    >
        <v-tab-item v-for="round in event.rounds" :key="round.round">
            <results-table
                :compId="comp.id"
                :event="event.event"
                :round="round.round"
                :type="round.type"
                :isFinal="(round.round == String(event.rounds.length)) ? true : false"
            />
        </v-tab-item>
    </v-tabs-items>
</v-container>
</template>
<script>
import ofcEvents from '../../forms/events.js'
import { pop } from '../../mixins/global/pop.js'
import { comp } from '../../components/comp/mixin.js'
import resultsTable from '../../components/comp/results/table.vue'
export default {
    mixins: [pop, comp],
    components: { resultsTable },
    data: function () {
        return {
            ready: false,
            comp: {},
            ofcEvents: ofcEvents.events,
            tabs: 0
        }
    },
    computed: {
        event () {
            if(this.ready) {
                let thisEv = {}
                this.comp.eventsDetail.forEach(ev => {
                    if(this.$route.params.event == ev.event) {
                        thisEv = ev
                    }
                })

                return thisEv
            }
            else {
                return {}
            }
        }
    },
    mounted: async function () {
        await this.$_setComp()
        this.ready = true
    }
}
</script>
