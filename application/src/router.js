import Vue from 'vue'
import Router from 'vue-router'

// Pages
import Kns from '@/pages/Knowledges'
import Work from '@/pages/Works'
import Auth from '@/pages/Auth'
import NotFound from '@/pages/NotFound'

// User authenticate
import {user} from './api/authenticate'

Vue.use(Router)

// Application routes
const routes = [
  {
    path: '/knowledges',
    name: 'Kns',
    component: Kns,
    meta: {
      requiredAuth: true
    }
  },
  {
    path: '/works',
    name: 'Work',
    component: Work,
    meta: {
      requiredAuth: true
    }
  },
  {
    path: '/login',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/404',
    name: '404',
    component: NotFound,
    meta: {
      requiredAuth: true
    }
  },
  {
    path: '*',
    redirect: '/404'
  }
]
const router = new Router({
  routes,
  linkActiveClass: 'is-active'
})

// Переброс пользователя к странице авторизации
router.beforeEach((to, from, next) => {
  if (to.meta.requiredAuth) {
    if (user.authenticated) {
      next()
    } else {
      router.push('/login')
    }
  } else {
    next()
  }
})

export default router
