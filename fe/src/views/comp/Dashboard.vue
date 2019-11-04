<template>
<v-container>
<v-row>
    <v-container style="width:100%;" class="pa-5">
        <v-row class="pa-0">
            <v-col md=6 sm=12>
                <v-hover v-slot:default="{ hover }">
                    <v-card class="" outlined :elevation="hover ? 5 : 0" width="100%">
                        <v-card-text>
                            <div>D-Day</div>
                            <p class="text-center display-4 bl">{{dday}}</p>
                        </v-card-text>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
    </v-container>
</v-row>
</v-container>
</template>
<script>
// mixins
import { pop } from '../../mixins/global/pop.js'
import { comp } from '../../components/comp/mixin.js'

//tabs
export default {
    components:{
        // tabOverview, tabSettings, tabRegs, tabRounds
    },
    mixins: [pop, comp],
    data: function () {
        return {
            comp: {}
        }
    },
    methods: {
    },
    computed: {
        start () {
            if(this.comp.date != undefined) {
                return this.comp.date.start
            } else {
                return new Date()
            }
        },
        dday () {
            const start = this.$moment(this.start).format()
            const now = this.$moment().format('YYYY-MM-DD')

            const diff = this.$moment(start).diff(now, 'days')

            return diff
        }
    },
    mounted () {
        this.$_setComp()
    }
}
</script>
