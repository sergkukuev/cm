import Vue from 'vue'
import Router from 'vue-router'

// Pages
import Auth from '@/components/pages/Authentication/Auth.vue'
import Kns from '@/components/pages/Knowledge'

// Global components
import Navigate from '@/components/Navigate'
import Footer from '@/components/Footer'

Vue.component('app-navbar', Navigate)
Vue.component('app-footer', Footer)
Vue.use(Router)

// Application routes
const routes = [
  { path: '/login', component: Auth },
  { path: '/knowledge', component: Kns }
]
export default new Router({
  routes,
  linkActiveClass: 'is-active'
})
