<template>
<v-hover v-slot:default="{ hover }">
    <v-card
        outlined
        :elevation="hover ? 4 : 0"
        :to="`rounds/${event}`"
    >
        <v-container class="pa-0">
            <v-row justify="center">
                <div class="text-center pt-5 pb-5 title">{{ ofcEvents.events[event] }}</div>
            </v-row>
            <v-row justify="center">
                <v-col align="center" class="pt-0 pb-5">
                    <v-progress-circular
                        :rotate="360"
                        :size="100"
                        :width="15"
                        :value="value"
                        color="teal"
                    >
                        {{ num }}
                    </v-progress-circular>
                </v-col>
            </v-row>
            <v-row>
                <v-col v-if="rounds.length > 0" align="center">라운드 {{rounds.length}}</v-col>
                <v-col v-else align="center">시작 전</v-col>
            </v-row>
        </v-container>
    </v-card>
</v-hover>
</template>
<script>
import ofcEvents from '../../../forms/events.js'
export default {
    components: {
    },
    props: {
        event: { type: String },
        rounds: { type: Array },
        num: { type: Number }
    },
    data: function () {
        return {
            value: 0,
            ofcEvents: ofcEvents
        }
    },
    mounted () {
    }
}
</script>
