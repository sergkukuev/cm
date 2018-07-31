<template>
  <!-- Список задач для направления в элемент card -->
  <v-card-text style="height: 300px">
    <v-layout row wrap :class="frame" justify-center v-if="tasks.length == 0">
      <span>{{ no_data }}</span>
    </v-layout>
    <v-layout row wrap :class="frame" v-else v-for="(task, i) in tasks" :key="i">
      <v-flex xs10>
        <span>
          <span v-if="task.name == ''">Задача {{i + 1}}</span>
          <span v-else>{{ task.name }}</span>
          <br>
          (Квалификация: {{ find_rank(task.rank.value) }}
          <span class="hidden-xs-only">
            , кол-во знаний: {{ task.need.length }}
          </span>
          )
        </span>
      </v-flex>
      <v-flex xs2 align-start text-xs-right>
        <v-tooltip bottom>
          <v-icon slot="activator"
            @click="$emit('editAction', i + 1)"
            class="mx-1"
          >
            edit
          </v-icon>
          <span>Изменить</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-icon slot="activator"
            class="mx-1"
            @click="$emit('deleteAction', i + 1)"
          >
            delete
          </v-icon>
          <span>Удалить</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
  </v-card-text>
</template>

<script>
export default {
  props: ['tasks'],
  data () {
    return {
      frame: 'background subheading font-weight-light mb-2 py-2 pl-3',
      no_data: 'Задачи отсутствуют',
      ranks: [
        { text: 'ведущий', value: 0 },
        { text: '1 кат.', value: 1 },
        { text: '2 кат.', value: 2 },
        { text: '3 кат.', value: 3 },
        { text: 'б/кат', value: 4 }
      ]
    }
  },
  methods: {
    find_rank (value) {
      for (let i = 0; i < this.ranks.length; i++) {
        if (this.ranks[i].value === value) {
          return this.ranks[i].text
        }
      }
      return value // Не найдено
    }
  }
}
</script>
