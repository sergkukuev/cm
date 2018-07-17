<template>
  <v-footer color="primary" inset app>
      <v-spacer></v-spacer>
      <span class="white--text">
        &copy;{{ copyright }} — <strong>{{ company }}</strong>
      </span>
      <v-spacer></v-spacer>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    copyright: 2018,
    company: 'СБ-113'
  })
}
</script>
