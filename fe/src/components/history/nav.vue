<template>
<v-navigation-drawer
    app
    clipped
    v-model="drawer"
    left
    :temporary="($vuetify.breakpoint.smAndDown) ? true : false"
    :permanent="($vuetify.breakpoint.smAndDown) ? false : true"
>
    <v-row class="ma-0 pa-2" justify="center">
        옵션
    </v-row>
    <v-divider></v-divider>
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
</template>
<script>
import ofcEvents from '../../forms/events.js'
export default {
    data: function () {
        return {
            ofcEvents : ofcEvents.eventsArr,
            drawer: false,
            ev: '333',
            type: 'mean'
        }
    },
    methods: {
        changeEv(ev) {
            this.ev = ev
            this.$EventBus.$emit('historyEv', ev)
        },
        changeType(type) {
            this.type = type
            this.$EventBus.$emit('historyType', type)
        }
    },
    mounted () {
        this.$EventBus.$on('historyOptInit', opt => {
            this.ev = opt.ev
            this.type = opt.type
        })
        this.$EventBus.$on('navHistoryDrawer', () => this.drawer = !this.drawer)
    }
}
</script>
