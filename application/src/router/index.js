import Vue from 'vue'
import Router from 'vue-router'

// Pages
import Auth from '@/components/pages/auth/Auth.vue'
import Kns from '@/components/pages/kns/Knowledge'
import Work from '@/components/pages/works/Work'

// Global components
import Navigate from '@/components/Navigate'
import Footer from '@/components/Footer'

Vue.component('app-navbar', Navigate)
Vue.component('app-footer', Footer)
Vue.use(Router)

// Application routes
const routes = [
  { path: '/login', component: Auth },
  { path: '/knowledge', component: Kns },
  { path: '/work', component: Work }
]
export default new Router({
  routes,
  linkActiveClass: 'is-active'
})
