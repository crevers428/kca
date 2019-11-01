<template>
<v-container>
    <v-row>
        <v-col
            cols="6"
            md="3"
            lg="2"
            v-for="ev in this.comp.eventsDetail" :key="ev.event"
        >
            <event-card v-bind="ev"></event-card>
        </v-col>
    </v-row>
</v-container>
</template>
<script>
import { pop } from '../../mixins/global/pop.js'
import { comp } from '../../components/comp/mixin.js'

import EventCard from '../../components/comp/rounds/card'
export default {
    components: { EventCard },
    mixins: [pop, comp],
    data: function () {
        return {
            comp: {}
        }
    },
    created: async function () {
        await this.$_setComp()
    }
}
</script>
