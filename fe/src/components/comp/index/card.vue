<template>
    <v-row class="ma-1 mb-3">
        <v-hover v-slot:default="{ hover }">
            <v-card class="" outlined :elevation="hover ? 5 : 0" width="100%">
                <v-toolbar dark color="primary" elevation=0>
                    <v-toolbar-title dark>
                        <div @click="$router.push(`/comp/${comp.id}/dashboard`)" style="cursor: pointer;">{{comp.name}}</div>
                    </v-toolbar-title>
                </v-toolbar>

                <v-card-text class="pa-0">
                    <v-row class="pa-3">
                        <v-col>대회 날짜</v-col>
                        <v-col class="text-right black--text" style="white-space: nowrap;">
                            <div>{{$moment(comp.date.start).format('ll')}}</div>
                            <div v-if="$moment(comp.date.end).diff(comp.date.start, 'days') > 0"> ~ {{$moment(comp.date.end).format('LL')}}</div>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                        <v-expand-transition>
                            <v-row class="pa-3" v-show="more">
                                <v-col cols=2 stlye="white-space:nowrap;">종목</v-col>
                                <v-col class="text-right">
                                    <v-chip style="margin: 1px" v-for="ev in comp.events" :key="ev" color="primary" dark>{{events.events[ev]}}</v-chip>
                                </v-col>
                            </v-row>
                        </v-expand-transition>
                </v-card-text>

                <v-hover v-slot:default="{ hover }">
                    <v-toolbar
                        elevation=0
                        color="#EEEEEE"
                        style="cursor: pointer;"
                        @click="more = !more"
                        height="40"
                    >
                        <v-spacer></v-spacer>
                        <v-toolbar-title style="font-size:1rem;">
                            <v-icon
                                v-if="more"
                                style="position: relative"
                                :style="`top: ${hover ? '-2px' : '0'};`"
                            >
                                keyboard_arrow_up
                            </v-icon>
                            <v-icon
                                v-else
                                style="position: relative"
                                :style="`top: ${hover ? '2px' : '0'};`"
                            >
                                keyboard_arrow_down
                            </v-icon>
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-hover>
            </v-card>
        </v-hover>
    </v-row>
</template>
<script>
import Events from '../../../forms/events.js'
export default {
    props: {
        comp: Object

    },
    data: () => ({
        events: Events,
        more: false
    }),
    methods: {
    }
}
</script>
