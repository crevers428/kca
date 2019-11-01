<template>
<v-container>
    <v-row v-for="ev in comp.eventsDetail" justify="center" :key="ev.event">
        <v-col
            :cols="($vuetify.breakpoint.smAndDown) ? 12 : 8"
            class="text-center" style="position: relative"
        >
            <div class="display-1">{{ofcEvents[ev.event]}}</div>
        </v-col>
        <v-col
            :cols="($vuetify.breakpoint.smAndDown) ? 12 : 8"
            class="mb-0 pb-0" style="position:relative;"
        >
            <results-table
                :compId="comp.id"
                :event="ev.event"
                :round="ev.rounds[ev.rounds.length - 1].round"
                :type="ev.rounds[ev.rounds.length - 1].type" :limit="3"
                isFinal
            />
        </v-col>
        <v-col
            align="right"
            :cols="($vuetify.breakpoint.smAndDown) ? 12 : 8"
            class="mt-0"
        >
            <v-btn
                class="mx-2"
                dark color="indigo"
                :to="`results/${ev.event}`"
            >
                전체보기
            </v-btn>
        </v-col>
    </v-row>
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
            records: [],
            ofcEvents: ofcEvents.events
        }
    },
    methods: {
    },
    mounted: async function () {
        await this.$_setComp()
        this.ready = true
    }
}
</script>
