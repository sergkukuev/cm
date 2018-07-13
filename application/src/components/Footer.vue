<template>
  <v-footer height="auto" color="primary lighten-1">
    <v-flex primary lighten-2 py-3 text-xs-center white--text xs12>
      &copy;{{ copyright }} — <strong>{{ company }}</strong>
    </v-flex>
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
