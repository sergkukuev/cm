<template>
  <v-app>
    <app-navbar></app-navbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
export default {
  name: 'Application',
  data () {
    return {
    }
  }
}
</script>
