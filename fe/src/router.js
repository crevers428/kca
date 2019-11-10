import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'

import Home from './views/Home.vue'
import Signin from './views/sign/In.vue'
import Signup from './views/sign/Up.vue'

import Ranking from './views/Ranking.vue'
import People from './views/People.vue'
import Person from './views/Person.vue'
import History from './views/History.vue'

import CompIndex from './views/comp/Index.vue'
import CompResults from './views/comp/Results.vue'
import CompResult from './views/comp/Result.vue'
import CompNew from './views/comp/New.vue'
import CompDashboard from './views/comp/Dashboard.vue'

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
        path: '/ranking/:event?/:type?/:limit?',
        name: 'ranking',
        component: Ranking
    },

    {
        path: '/history/:event?/:type?',
        name: 'history',
        component: History
    },

    {
        path: '/person',
        name: 'people',
        component: People
    },
    {
        path: '/person/:id',
        name: 'person',
        component: Person
    },

    {
        path: '/record',
        name: 'records',
        component: () => import('./views/Record.vue'),
        beforeEnter: pageCheck
    },
    
    {
        path: '/record/mod/:_id',
        name: 'record',
        component: () => import('./views/Record.vue'),
        beforeEnter: pageCheck
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
        component: () => import('./views/comp/Regs.vue'),
        beforeEnter: pageCheck
    },
    {
        path: '/comp/:id/rounds',
        name: 'compRounds',
        component: () => import('./views/comp/Rounds.vue'),
        beforeEnter: pageCheck
    },
    {
        path: '/comp/:id/rounds/:ev',
        name: 'compRound',
        component: () => import('./views/comp/Round.vue'),
        beforeEnter: pageCheck
    },
    {
        path: '/comp/:id/settings',
        name: 'compSettings',
        component: () => import('./views/comp/Settings.vue'),
        beforeEnter: pageCheck
    },

    {
        path: '/user',
        name: 'user',
        component: () => import('./views/user/Index.vue'),
        beforeEnter: pageCheck
    },
    {
        path: '/page',
        name: 'page',
        component: () => import('./views/Page.vue'),
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
