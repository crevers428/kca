<template>
<v-app>
    <app-bar v-if="mode != 'comp'" :navs="navs"></app-bar>
    <navigation
        v-bind:navs="navs"
    >
    </navigation>
    <bar-comp v-if="mode == 'comp'"></bar-comp>
    <nav-comp v-if="mode == 'comp'"></nav-comp>
    <nav-ranking v-if="mode == 'ranking'"></nav-ranking>
    <nav-history v-if="mode == 'history'"></nav-history>
    <v-content>
        <router-view/>
    </v-content>
    <nav-comp-trigger v-if="mode == 'comp'"></nav-comp-trigger>
    <pop-snack></pop-snack>
</v-app>
</template>
<style>
.none_underline a, .none_underline {
    text-decoration: none;
}
</style>
<script>
import navigation from './components/main/nav.vue'
import appBar from './components/main/appBar.vue'
import popSnack from './components/main/pop.vue'
import navComp from './components/comp/nav.vue'
import navCompTrigger from './components/comp/navTrigger.vue'
import navRanking from './components/ranking/nav.vue'
import navHistory from './components/history/nav.vue'
import barComp from './components/comp/bar.vue'
export default {
    components: { navigation, appBar, popSnack, navComp, navCompTrigger, navRanking, navHistory, barComp },
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
                        title: '역대 기록',
                        to: "/history"
                    },
                    {
                        title: '개인 기록',
                        to: "/person"
                    }
                ]
            },
            {
                title: "데이터 관리",
                to: "",
                admin: true,
                subs: [
                    {
                        title: '기록 편집',
                        to: "/record/mod"
                    },
                    {
                        title: '대회 편집',
                        to: "/comp/mod"
                    },
                    {
                        title: '선수 편집',
                        to: "/person/mod"
                    }
                ]
            }
        ]
    }),
    computed: {
        mode () {
            if(this.$route.matched[0] != undefined) {
                if(/^\/comp\/:id/g.test(this.$route.matched[0].path)) return 'comp'
                else if(/^\/ranking/g.test(this.$route.matched[0].path)) return 'ranking'
                else if(/^\/history/g.test(this.$route.matched[0].path)) return 'history'
                else return ''
            }
            return ''
        }
    }
};
</script>
