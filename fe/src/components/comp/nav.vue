<template>
<v-navigation-drawer
    app
    color="indigo lighten-1"
    dark
    mini-variant
    :temporary="($vuetify.breakpoint.smAndDown) ? true : false"
    :permanent="($vuetify.breakpoint.smAndDown) ? false : true"
    v-model="drawer"
>
    <v-row justify="center" class="pb-5">
        <v-col cols=12 justify="center" align="center">
            <v-btn icon to="/comp/past" x-large>
                <v-icon>home</v-icon>
            </v-btn>
        </v-col>
    </v-row>
    <v-row justify="center">
        <v-col cols=12 justify="center" align="center">
            <v-btn icon :to="`${base}/dashboard`" x-large>
                <v-icon>dashboard</v-icon>
            </v-btn>
        </v-col>
    </v-row>
    <v-row justify="center">
        <v-col cols=12 justify="center" align="center">
            <v-btn icon :to="`${base}/results`" x-large>
                <v-icon>format_list_numbered</v-icon>
            </v-btn>
        </v-col>
    </v-row>
    <v-row justify="center">
        <v-col cols=12 justify="center" align="center" v-if="$store.state.token">
            <v-btn icon :to="`${base}/regs`" x-large>
                <v-icon>how_to_reg</v-icon>
            </v-btn>
        </v-col>
    </v-row>
    <v-row justify="center">
        <v-col cols=12 justify="center" align="center" v-if="$store.state.token">
            <v-btn icon :to="`${base}/rounds`" x-large>
                <v-icon>add_alarm</v-icon>
            </v-btn>
        </v-col>
    </v-row>
    <v-row justify="center">
        <v-col cols=12 justify="center" align="center" v-if="$store.state.token">
            <v-btn icon :to="`${base}/settings`" x-large>
                <v-icon>build</v-icon>
            </v-btn>
        </v-col>
    </v-row>
    <v-row justify="center" class="pt-10" v-if="$store.state.token">
        <v-col cols=12 justify="center" align="center">
            <v-btn icon @click="deleteComp" x-large>
                <v-icon color="red">delete_outline</v-icon>
            </v-btn>
        </v-col>
    </v-row>
</v-navigation-drawer>
</template>
<script>
import { pop } from '../../mixins/global/pop.js'
export default {
    mixins: [pop],
    props: {},
    data: () => ({
        drawer: false
    }),
    created () {
        this.$EventBus.$on('navCompDrawer', () => this.drawer = !this.drawer)
    },
    methods: {
        deleteComp () {
            if(confirm('정말 대회를 삭제하시겠습니까?')) {
                this.$axios.delete(`competition/${this.$route.params.id}`)
                    .then(() => {
                        this.$_error('대회가 성공적으로 삭제되었습니다.')
                        this.$router.push('/comp')
                    })
                    .catch((e) => {
                        this.$_error(e.message)
                    })
            }
        }
    },
    computed: {
        base () {
            return `/comp/${this.$route.params.id}`
        }
    },
    mounted () {

    }
}
</script>
