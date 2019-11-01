import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'

import Home from './views/Home.vue'
import Signin from './views/sign/In.vue'
import Signup from './views/sign/Up.vue'

import User from './views/user/Index.vue'
import Page from './views/Page.vue'

import Ranking from './views/Ranking.vue'

import CompIndex from './views/comp/Index.vue'
import CompResults from './views/comp/Results.vue'
import CompResult from './views/comp/Result.vue'
import CompNew from './views/comp/New.vue'
import CompDashboard from './views/comp/Dashboard.vue'
import CompRegs from './views/comp/Regs.vue'
import CompRounds from './views/comp/Rounds.vue'
import CompRound from './views/comp/Round.vue'
import CompSettings from './views/comp/Settings.vue'

import Note from './views/Note.vue'

Vue.use(Router)

// set prototype for http
const apiRootPath = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/api/' : '/api/'
Vue.prototype.$apiRootPath = apiRootPath
Vue.prototype.$axios = axios

// config for axios
axios.defaults.baseURL = apiRootPath
axios.defaults.headers.common['Authorization'] = (localStorage.getItem('token') == null) ? '' : localStorage.getItem('token')

// set interceptors for req, res
    // add req interceptors to include token automatically
axios.interceptors.request.use(function (config) {
    config.headers.Authorization = localStorage.getItem('token')
    return config
}, function(error) {
    return Promise.reject(error)
})
axios.interceptors.response.use(function (response) {
    const token = response.headers.token
    if (token != 'null' && token != undefined) {
        localStorage.setItem('token', token)
    }
    if(response.data.expired) {
        localStorage.removeItem('token', token)
        location.reload()
    }
    return response
}, function (error) {
    console.log(error.response.data.message)
    return Promise.reject(error)
})

const pageCheck = (to, from, next) => {
    axios.post('page', { name: to.path.replace('/', '') })
        .then((r) => {
            if (!r.data.success) throw Error(r.data.msg)
            next()
        })
        .catch((e) => {
            console.error(e)
            if(localStorage.getItem('token')) next('/signin')
            next('/block')
            // next('`/block/${e.message}`')
        })
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
      path: '/note',
      name: 'note',
      component: Note
    },
    {
        path: '/signin',
        name: 'signin',
        component: Signin
    },
    {
        path: '/signup',
        name: 'signup',
        component: Signup
    },

    {
        path: '/ranking',
        name: 'ranking',
        component: Ranking
    },

    {
        path: '/comp',
        name: 'comp',
        component: CompIndex
    },
    {
        path: '/comp/up',
        name: 'compUp',
        component: CompIndex
    },
    {
        path: '/comp/past',
        name: 'compRes',
        component: CompIndex
    },
    {
        path: '/comp/new',
        name: 'compNew',
        component: CompNew,
        beforeEnter: pageCheck
    },
    {
        path: '/comp/:id/results',
        name: 'compResults',
        component: CompResults
    },
    {
        path: '/comp/:id/results/:event',
        name: 'compResult',
        component: CompResult
    },
    {
        path: '/comp/:id/dashboard',
        name: 'compDashboard',
        component: CompDashboard
    },
    {
        path: '/comp/:id/regs',
        name: 'compRegs',
        component: CompRegs,
        beforeEnter: pageCheck
    },
    {
        path: '/comp/:id/rounds',
        name: 'compRounds',
        component: CompRounds,
        beforeEnter: pageCheck
    },
    {
        path: '/comp/:id/rounds/:ev',
        name: 'compRound',
        component: CompRound,
        beforeEnter: pageCheck
    },
    {
        path: '/comp/:id/settings',
        name: 'compSettings',
        component: CompSettings,
        beforeEnter: pageCheck
    },

    {
        path: '/user',
        name: 'user',
        component: User,
        beforeEnter: pageCheck
    },
    {
        path: '/page',
        name: 'page',
        component: Page,
        beforeEnter: pageCheck
    },
    {
        path: '/block',
        name: 'block',
        component: () => import('./views/Block.vue')
    },
    {
      path: '*',
      name: 'e404',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/E404.vue')
  }
  ]
})
