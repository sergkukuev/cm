<template>
  <v-app>
    <app-navbar></app-navbar>
    <router-view/>
    <!-- <app-footer></app-footer> -->
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
