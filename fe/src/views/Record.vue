<template>
<v-container>
    <v-row justify="center">
        <v-col sm=12 md=10 class="pb-0 mb-0">
            <div class="" style="font-size: 1rem; color:#4D4D4D;">기록 수정</div>
        </v-col>
    </v-row>
    <v-row justify="center">
        <v-col sm=12 md=10>
            <div style="font-size: 2.2rem;" class="">{{ record.personName }} ({{ record.personId }})</div>
            <div style="color:#4D4D4D; font-size: 0.8rem;">
                <span class="pl-3 pr-3">{{ record.compName }}</span>
                <span class="pl-3 pr-3">{{ ofc[record.event] }}</span>
                <span class="pl-3 pr-3">라운드 {{ record.round }}</span>
            </div>
        </v-col>
    </v-row>
    <v-divider class="mt-3 mb-3"></v-divider>
    <v-row justify="center">
        <v-col >
            <info v-bind="record"></info>
        </v-col>
            <v-col md="auto" align="center">
                <score-taker
                    v-if="ready"
                    v-model="record.detail"
                    :old="detailOld"
                    :type="record.type"
                    @submit="submit()"
                >
                </score-taker>
            </v-col>
    </v-row>
</v-container>
</template>
<script>
import { pop } from '../mixins/global/pop.js'
import ofcEvents from '../forms/events.js'
import ScoreTaker from '../components/record/scoreTaker.vue'
import Info from '../components/record/info.vue'
export default {
    components: { ScoreTaker, Info },
    mixins: [pop],
    data: function () {
        return {
            ofc: ofcEvents.events,
            ready: false,
            record: {},
            detailOld: []
        }
    },
    methods: {
        setRecord () {
            this.$axios.get(`records/mod/${ this.$route.params._id }`)
                .then(r => {
                    if(!r.data.r) throw new Error("No record from db.")
                    this.record = r.data.r
                    this.detailOld = JSON.parse(JSON.stringify(this.record.detail))
                    this.ready = true
                })
                .catch(e => {
                    this.$_error(e.message)
                })
        },
        submit () {
            this.$axios.put(`records/mod/${ this.$route.params._id }`, { detail: this.record.detail })
                .then(() => {
                    this.setRecord()
                    this.$_pop('기록이 수정되었습니다.')
                })
                .catch(e => {
                    this.$_error(e)
                })
        }
    },
    mounted () {
        this.setRecord()
    }
}
</script>
