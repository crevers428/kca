<template>
    <v-navigation-drawer
        app
        v-model="drawer"
        right
        temporary
        touchless
    >
        <v-list v-for="(nav, i) in filteredNavs" :key="i">
            <v-list-item
                :to="nav.to"
            >
                <v-list-item-title class="font-weight-bold">{{nav.title}}</v-list-item-title>
            </v-list-item>
            <v-list-item v-for="(sub, k) in nav.subs" :key="k" :to="sub.to">
                <v-list-item-title class="pl-5">{{sub.title}}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
export default {
    props: { navs: Array },
    data: () => ({
        drawer: false
    }),
    computed: {
        filteredNavs () {
            const filtered = []
            this.navs.forEach(main => {
                if(!main.admin || this.$store.state.token) {
                    if(main.admin) {
                        filtered.push(main)
                    }
                    else {
                        const nav = { title: main.title, to: main.to, subs: []}
                        if(main.subs != undefined) {
                            main.subs.forEach(sub => {
                                if(!sub.admin || this.$store.state.token) {
                                    nav.subs.push(sub)
                                }
                            })
                        }
                        filtered.push(nav)
                    }
                }
                else {
                    if(!main.admin) {
                        filtered.push(main)
                    }
                }
            })

            return filtered
        }
    },
    created () {
        this.$EventBus.$on('navDrawer', () => this.drawer = !this.drawer)
    }
}
</script>
