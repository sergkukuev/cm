<template>
  <v-footer color="primary">
    <v-layout justify-space-between align-center row wrap >
      <v-btn v-for="link in links" :key="link" color="white" small flat round @click="my_location(link)">
        {{ link }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-flex xs2 class="pl-5">
        <v-text-field dark v-model="user" disabled white--text append-icon="account_circle"></v-text-field>
      </v-flex>
      <v-btn color="red white--text" round small>
        Выйти
      </v-btn>
    </v-layout>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: [
      'Матрица',
      'Типовые работы',
      'Знания'
    ],
    sites: [
      '/cm',
      '/work',
      '/knowledge'
    ],
    user: 'Admin Adminich'
  }),
  methods: {
    my_location (link) {
      let flExit = false
      let index = -1
      for (let i = 0; i < this.links.length && !flExit; i++) {
        if (this.links[i] === item) {
          flExit = true
          index = i
        }
      }
      if (index !== -1) {
        window.location = 'http://localhost:8080/#' + this.sites[index]
      }
    }
  }
}
</script>
