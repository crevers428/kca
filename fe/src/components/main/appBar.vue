<template>
<v-hover v-slot:default="{ hover }">
<v-app-bar
    app
    :color="scrolled || hover || !appBarTrans ? 'indigo' : 'transparent'"
    dark
    :elevation="scrolled || hover || !appBarTrans ? 4 : 0"
    elevate-on-scroll
>
    <!-- -->
    <v-card
        v-show="hover && !$vuetify.breakpoint.smAndDown"
        style="
            position:absolute;
            top:100%;
            width:100%;
            height: 200px;
            background:white;
            left:0;
        "
    >
    </v-card>
    <v-toolbar-title class="text-uppercase" @click="$router.push('/')">
        <img :src="require('../../assets/kca_logo.png')" style="width:20px; vertical-align:middle; position:relative; top:-3px;">
        <span class="ml-3">한국큐브협회</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items v-show="!$vuetify.breakpoint.smAndDown">
        <v-list
            v-for="(nav, i) in navs"
            :key="i"
            color="transparent"
            width="150px"
        >
            <v-list-item class="text-center mb-5" :to="nav.to">
                <v-list-item-title style="font-size:1.2rem;">{{nav.title}}</v-list-item-title>
            </v-list-item>
            <v-list-item
                v-for="(sub, k) in nav.subs"
                v-show="hover"
                :key="k"
                class="text-center"
                :to="sub.to"
                light
            >
                <v-list-item-title style="color: black;">{{sub.title}}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-btn icon to="/signin" v-if="!$store.state.token">
        <v-icon dense color="error">power_settings_new</v-icon>
    </v-btn>
    <v-btn icon @click="signout" v-else>
        <v-icon dense color="white">power_settings_new</v-icon>
    </v-btn>
    <!-- <v-btn icon to="/user">
        <v-icon dense>account_circle</v-icon>
    </v-btn> -->
    <v-app-bar-nav-icon
        @click.stop="navDrawer"
        v-show="$vuetify.breakpoint.smAndDown"
    >
    </v-app-bar-nav-icon>
</v-app-bar>
</v-hover>
</template>
<script>
export default {
    props: {
        navs: Array
    },
    data: () => ({
        scrolled: false,
        appBarTrans: false,
        drawer: false
    }),
    methods: {
        signout () {
            this.$store.commit('delToken')
            this.$router.push('/signin')
        },
        navDrawer () {
            this.$EventBus.$emit('navDrawer')
        }
    },
    components: {},
}
</script>
