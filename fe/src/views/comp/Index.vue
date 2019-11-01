<template>
<v-container
    style="max-width: 1024px;"
>
    <v-row
        justify="start"
        class="pa-3"
    >
        <hy-title
            v-bind="{
                    font: `font-family:'Sunflower'; font-weight:500;`,
                    position: 'relative',
                    positionOptions: ``,
                    borderLeft: 5,
                    borderColor: '#2E9AFE',
                    main: '대회 일정',
                    mainFont: 'font-size: 2rem;',
                    sub: '',
                    subFont: 'font-size: 1rem;',
                    sheet: false
            }"
            style="margin: 0 0 15px 0;"
        />
    </v-row>
    <comp-card v-for="comp in comps" :key="comp.id" v-bind:comp="comp"></comp-card>
    <v-btn
         v-if="$store.state.token"
        class="mx-2"
        fab dark large
        color="success"
        style="position: fixed; bottom: 1rem; right: 1rem;"
        to="/comp/new"
    >
        <v-icon dark outlined>add</v-icon>
    </v-btn>
</v-container>
</template>
<script>
import hyTitle from '../../components/hy/Title.vue'
import compCard from '../../components/comp/index/card.vue'
import { pop } from '../../mixins/global/pop.js'
export default {
    components: { hyTitle, compCard },
    mixins: [pop],
    data: () => ({
        comps: [],
        onForm: {},
    }),
    methods: {
        getComps () {
            this.$axios.get('competition')
                .then((r) => {
                    if(!r.data.success) throw new Error(r.data.msg)
                    this.comps = r.data.comps
                })
                .catch((e) => {
                    this.$_error(e.message)
                })
        }
    },
    mounted () {
        this.getComps()
    }
}
</script>
