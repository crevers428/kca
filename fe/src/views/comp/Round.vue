<template>
<v-container v-if="dataReady">
    <v-row>
        <v-col
            cols=6
            md=3
        >
            <v-hover v-slot:default="{ hover }">
                <v-card
                    :elevation="hover ? 4 : 0"
                    outlined
                >
                    <v-progress-circular
                        :rotate="360"
                        :size="100"
                        :width="15"
                        :value="value"
                        color="teal"
                    >
                        {{}}
                    </v-progress-circular>
                </v-card>
            </v-hover>
        </v-col>
    </v-row>
</v-container>
</template>
<script>
import { pop } from '../../mixins/global/pop.js'
import { comp } from '../../components/comp/mixin.js'
export default {
    mixins: [pop, comp],
    data: function () {
        return {
            dataReady: false,
            comp: {},
            value: 10,
            test: null
        }
    },
    computed: {
        num () {
            return this.detail.num
        }
    },
    methods: {
    },
    beforeMount: async function () {
        await this.$_setComp()
        this.dataReady = true
    },
    mounted () {
        console.log(this.comp)
    }
}
</script>
