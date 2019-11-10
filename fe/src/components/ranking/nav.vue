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
</template>
<script>
import { pop } from '../../mixins/global/pop.js'
import ofcEvents from '../../forms/events.js'
export default {
    mixins: [pop],
    data: function () {
        return {
            ofcEvents : ofcEvents.eventsArr,
            drawer: false,
            limit: 100,
            ev: '333',
            type: 'mean',
            division: 'all'
        }
    },
    methods: {
        changeEv(ev) {
            this.ev = ev
            this.$EventBus.$emit('rankingEv', ev)
        },
        changeType(type) {
            this.type = type
            this.$EventBus.$emit('rankingType', type)
        },
        changeLimit(limit) {
            this.limit = limit
            this.$EventBus.$emit('rankingLimit', limit)
        }
    },
    mounted () {
        this.$EventBus.$on('rankingOptInit', opt => {
            this.ev = opt.ev
            this.type = opt.type
            this.limit = opt.limit
        })
        this.$EventBus.$on('navRankingDrawer', () => this.drawer = !this.drawer)
    }
}
</script>
