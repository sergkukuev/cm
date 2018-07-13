import Vue from 'vue'
import Router from 'vue-router'

// Pages
import Auth from '@/components/pages/Authentication/Auth.vue'
import Kn from '@/components/pages/Knowledge.vue'
import KnList from '@/components/Knowledge/List.vue'

// Global components
import Navigate from '@/components/Navigate'
Vue.component('app-navbar', Navigate)
Vue.component('kn-list', KnList)
Vue.use(Router)

// Application routes
const routes = [
  { path: '/login', component: Auth },
  { path: '/knowledges', components: { default: Kn, navbar: Navigate, list: KnList } }
]
export default new Router({
  routes,
  linkActiveClass: 'is-active'
})
