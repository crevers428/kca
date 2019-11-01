<template>
    <v-navigation-drawer
        app
        v-model="drawer"
        right
        temporary
    >
        <v-list v-for="(nav, i) in navs" :key="i">
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
    created () {
        this.$EventBus.$on('navDrawer', () => this.drawer = !this.drawer)
    }
}
</script>
