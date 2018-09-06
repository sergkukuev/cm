<template>
  <v-app>
    <app-navigate :checker="nav_drawer"></app-navigate>
    <v-toolbar color="primary" dark app fixed clipped-left>
      <v-toolbar-title style="width: 400px" class="ml-0 pl-0">
        <v-toolbar-side-icon @click.native="nav_drawer = !nav_drawer">
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
import NavBar from '@/components/Navigate'

export default {
  name: 'Application',
  components: {
    'app-navigate': NavBar
  },
  data () {
    return {
      nav_drawer: false
    }
  }
}
</script>

<style>
  .text {
    font-weight: 400;
  }
</style>
