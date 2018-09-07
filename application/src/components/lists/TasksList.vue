<!-- Компонент: список задач направления -->
<template>
  <div>
    <v-layout v-if="tasks.length == 0"
      :class="frame_style"
      justify-center
      row
      wrap
    >
      <span>Задачи отсутствуют</span>
    </v-layout>
    <v-layout v-else
      v-for="(task, i) in tasks"
      :key="i"
      :class="frame_style"
      row
      wrap
    >
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
        <v-btn class="mx-1"
          @click="$emit('A-edit', i + 1)"
          color="amber darken-2"
          icon
          flat
        >
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn class="mx-1"
          @click="$emit('A-delete', i + 1)"
          color="grey darken-2"
          icon
          flat
        >
          <v-icon>delete</v-icon>
        </v-btn>
        <!-- <v-tooltip bottom>
          <v-icon slot="activator"
            @click="$emit('A-edit', i + 1)"
            class="mx-1"
          >
            edit
          </v-icon>
          <span>Изменить</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-icon slot="activator"
            class="mx-1"
            @click="$emit('A-delete', i + 1)"
          >
            delete
          </v-icon>
          <span>Удалить</span>
        </v-tooltip> -->
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: ['tasks'],
  data () {
    return {
      // Расшифровка рангов
      ranks: [
        { text: 'ведущий', value: 0 },
        { text: '1 кат.', value: 1 },
        { text: '2 кат.', value: 2 },
        { text: '3 кат.', value: 3 },
        { text: 'б/кат', value: 4 }
      ]
    }
  },
  computed: {
    // Стиль одного элемента списка
    frame_style () {
      let result = ['background',
        'subheading',
        'font-weight-light',
        'mb-2',
        'py-2',
        'pl-3'
      ]
      return result
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
