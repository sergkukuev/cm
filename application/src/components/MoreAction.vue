<!-- Компонент: кнопка дополнительных действий -->
<template>
  <v-speed-dial v-model="fab"
    transition="scale-transition"
    :direction="direction"
    :top="top"
    :bottom="bottom"
    :left="left"
    :right="right"
  >
    <v-btn slot="activator" flat icon :color="fab ? 'red darken-1' : color[0]">
      <v-icon v-if="!fab">more_vert</v-icon>
      <v-icon v-else>clear</v-icon>
    </v-btn>
    <v-card :color="color[1]" flat height=45>
      <v-layout align-start justify-center row>
        <v-btn flat icon color="grey darken-3" @click="$emit('A-search')">
          <v-icon>search</v-icon>
        </v-btn>
        <v-btn flat icon color="green darken-1" @click="$emit('A-add')">
          <v-icon>add</v-icon>
        </v-btn>
        <v-btn flat icon color="amber darken-1" @click="$emit('A-refresh')">
          <v-icon>refresh</v-icon>
        </v-btn>
      </v-layout>
    </v-card>
  </v-speed-dial>
</template>

<script>
export default {
  props: ['direction', 'position', 'color'],
  data () {
    return {
      fab: false, // Нажатие speed-dial
      // Позиция speed-dial
      top: this.check_position('top'),
      bottom: this.check_position('bottom'),
      right: this.check_position('right'),
      left: this.check_position('left')
    }
  },
  methods: {
    // Проверка позиции
    check_position (what) {
      let tokens = this.position.split(' ')
      let result = false
      for (let i = 0; i < tokens.length && !result; i++) {
        if (tokens[i] === what) {
          result = true
        }
      }
      return result
    }
  }
}
</script>
