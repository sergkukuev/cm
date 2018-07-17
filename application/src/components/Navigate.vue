<template>
  <v-footer color="primary">
    <v-layout justify-space-between align-center row wrap >
      <v-flex>
        <v-btn v-for="link in links" :key="link" color="white" small flat round>
        {{ link }}
      </v-btn>
      </v-flex>
      <v-flex md2>
        <v-text-field v-model="user" dark disabled white--text append-icon="account_circle"></v-text-field>
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
    user: 'Admin Adminich'
  })
}
</script>
