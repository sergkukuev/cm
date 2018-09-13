<template>
  <v-app>
    <app-navigate v-if="show_navigate" :checker="drawer" :login="get_login"></app-navigate>
    <v-toolbar color="primary" dark app fixed clipped-left>
      <v-toolbar-title style="width: 400px" class="ml-0 pl-0">
        <v-toolbar-side-icon v-if="show_navigate" @click.native="drawer = !drawer">
        </v-toolbar-side-icon>
        <span class="title ml-2 mr-5">
          Матрица&nbsp;
          <span class="text hidden-xs-only">компетенции</span>
        </span>
      </v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height class="background">
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import {user} from '@/api/authenticate'
import NavBar from '@/components/Navigate'

export default {
  name: 'Application',
  components: {
    'app-navigate': NavBar
  },
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    show_navigate () {
      return user.authenticated
    },
    get_login () {
      return this.$cookie.get('login')
    }
  }
}
</script>

<style>
  .text {
    font-weight: 400;
  }
</style>
