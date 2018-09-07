// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import App from './App'
import router from './router.js'

import VueCookie from 'vue-cookie'
import Vuetify from 'vuetify'
// Helpers
import colors from 'vuetify/es5/util/colors'
import('../node_modules/vuetify/dist/vuetify.min.css')

Vue.use(VueCookie)
// Можно добавить любой цвет в тему с любым названием, хоть azazazello
Vue.use(Vuetify, {
  theme: {
    primary: colors.grey.darken3,
    secondary: colors.amber.lighten1,
    accent: colors.amber.lighten4,
    background: colors.grey.lighten4
  }
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
