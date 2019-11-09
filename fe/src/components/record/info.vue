<template>
    <v-card
        outlined
        height="100%"
        class="pa-3"
    >
        <v-card-text style="color: #5D5D5D; font-size: 1rem;">
            <v-row>
                <v-col cols=4 md=2 class="text-left pa-1">
                    이름 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ personName }}
                </v-col>
                <v-col cols=4 md=2 class="text-left pa-1">
                    아이디 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ personId }}
                </v-col>
                <v-col cols=4 md=2 class="text-left pa-1">
                    대회 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ compName }}
                </v-col>
                <v-col cols=4 md=2 class="text-left pa-1">
                    종목 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ ofc[ev] }}
                </v-col>
                <v-col cols=4 md=2 class="text-left pa-1">
                    라운드 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ round }}
                </v-col>
                <v-col cols=4 md=2 class="text-left pa-1">
                    등록일 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ date }}
                </v-col>
                <v-col cols=4 md=2 class="text-left pa-1">
                    형식 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ type }}
                </v-col>
                <v-col cols=4 md=2 class="text-left pa-1">
                    순위 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ place }}
                </v-col>
                <v-col cols=4 md=2 class="text-left pa-1">
                    최고 기록 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ $_recordToText(best) }}
                </v-col>
                <v-col cols=4 md=2 class="text-left pa-1">
                    평균 기록 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ $_recordToText(mean) }}
                </v-col>
                <v-col cols=4 md=2 class="text-left pa-1">
                    NR 싱글 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ (nrSingle) ? 'NR' : '-' }}
                </v-col>
                <v-col cols=4 md=2 class="text-left pa-1">
                    NR 평균 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ (nrMean) ? 'NR' : '-' }}
                </v-col>
                <v-col cols=4 md=2 class="text-left pa-1">
                    PB 싱글 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ (pbSingle) ? 'PB' : '-' }}
                </v-col>
                <v-col cols=4 md=2 class="text-left pa-1">
                    PB 평균 :
                </v-col>
                <v-col cols=8 md=4 class="pa-1">
                    {{ (pbMean) ? 'PB' : '-' }}
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script>
import ofcEvents from '../../forms/events.js'
import { recordTrans } from './mixin.js'
export default {
    mixins: [ recordTrans ],
    props: {
        personName: { type: String },
        personId: { tpye: String },
        compName: { type: String },
        ev: { type: String },
        round: { type: Number},
        date: { type: String },
        type: { type: String },
        place: { type: Number },
        best: { type: Number },
        mean: { type: Number },
        nrSingle: { type: Boolean },
        nrMean: { type: Boolean },
        pbSingle: { type: Boolean },
        pbMean: { type: Boolean }
    },
    data: function () {
        return {
            ofc: ofcEvents.events
        }
    },
    watch: {

    }
}
</script>
