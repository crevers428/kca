import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import HyEvents from './plugins/hyEvents'
import AOS from 'aos'
import "aos/dist/aos.css"
import '@babel/polyfill'
import moment from 'moment'

Vue.config.productionTip = false

Vue.use(HyEvents)
// Vue.use(VeeValidate)
moment.locale('ko')
Vue.prototype.$moment = moment

Vue.prototype.$EventBus = new Vue()

new Vue({
    created () {
        AOS.init();
    },
    router,
    store,
    axios,
    vuetify,
    HyEvents,
    render: h => h(App)
}).$mount('#app')
