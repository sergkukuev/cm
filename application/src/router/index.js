import Vue from 'vue'
import Router from 'vue-router'

// Pages

import Auth from '@/components/pages/Authentication/Auth.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Auth',
      component: Auth
    }
  ]
})
