import Vue from 'vue'
import Router from 'vue-router'

// Pages
import Kns from '@/components/pages/kns/Knowledge'
import Work from '@/components/pages/works/Work'
import NotFound from '@/components/pages/NotFound'

// Global components
import Navigate from '@/components/Navigate'
import Footer from '@/components/Footer'

Vue.component('app-navbar', Navigate)
Vue.component('app-footer', Footer)
Vue.use(Router)

// Application routes
const routes = [
  { path: '/knowledge', component: Kns },
  { path: '/work', component: Work },
  { path: '/404', name: '404', component: NotFound },
  { path: '*', redirect: '/404' }
]
export default new Router({
  routes,
  linkActiveClass: 'is-active'
})
