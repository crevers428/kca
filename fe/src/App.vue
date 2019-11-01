<template>
<v-app>
    <app-bar v-if="mode != 'comp'" :navs="navs"></app-bar>
    <navigation
        v-bind:navs="navs"
    >
    </navigation>
    <bar-comp v-if="mode == 'comp'"></bar-comp>
    <nav-comp v-if="mode == 'comp'"></nav-comp>
    <v-content>
        <router-view/>
    </v-content>
    <nav-comp-trigger v-if="mode == 'comp'"></nav-comp-trigger>
    <pop-snack></pop-snack>
</v-app>
</template>
<script>
import navigation from './components/main/nav.vue'
import appBar from './components/main/appBar.vue'
import popSnack from './components/main/pop.vue'
import navComp from './components/comp/nav.vue'
import navCompTrigger from './components/comp/navTrigger.vue'
import barComp from './components/comp/bar.vue'
export default {
    components: { navigation, appBar, popSnack, navComp, navCompTrigger, barComp },
    name: 'App',
    data: () => ({
        navs: [
            { icon: "home", title: "한국큐브협회", to: "/" },
            {
                icon: "contact_support",
                title: "소개",
                to: "/greeting",
                subs:[
                    {
                        title: "인사말",
                        to: "/greeting"
                    },
                    {
                        title: "사업내용 안내",
                        to: "/business"
                    },
                    {
                        title: "임원진 소개",
                        to: "/organizers"
                    }
                ]
            },
            {
                icon: "build",
                title: "대회",
                to: "/comp",
                subs: [
                    {
                        title: "대회 일정",
                        to: "/comp/up"
                    },
                    {
                        title: "대회 결과",
                        to: "/comp/past"
                    }
                ]
            },
            {
                title: "대회 기록",
                to: "/ranking",
                subs: [
                    {
                        title: '랭킹',
                        to: "/ranking"
                    },
                    {
                        title: '개인 기록',
                        to: "/person"
                    }
                ]
            }
        ]
    }),
    computed: {
        mode () {
            if(this.$route.matched[0] != undefined) {
                if(/^\/comp\/:id/g.test(this.$route.matched[0].path)) return 'comp'
                else return ''
            }
            return ''
        }
    }
};
</script>
