import Vue from 'vue'
import Router from 'vue-router'

// Pages
import Kns from '@/pages/Knowledges'
import Work from '@/pages/Works'
import Auth from '@/pages/Auth'
import NotFound from '@/pages/NotFound'

Vue.use(Router)

// Application routes
const routes = [
  { path: '/knowledges', component: Kns },
  { path: '/works', component: Work },
  { path: '/404', name: '404', component: NotFound },
  { path: '*', redirect: '/404' },
  { path: '/login', component: Auth }
]
export default new Router({
  routes,
  linkActiveClass: 'is-active'
})
