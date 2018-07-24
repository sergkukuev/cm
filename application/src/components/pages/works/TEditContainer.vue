<template>
  <v-layout column wrap>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs11>
            <span class="title">Задача №{{index}}</span>
          </v-flex>
          <v-flex xs1 class="text-xs-right">
            <v-icon v-if="tasks.length > 1" small @click="delete_task">delete</v-icon>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs10>
            <v-text-field
              v-model="tasks[index - 1].name"
              label="Наименование">
            </v-text-field>
          </v-flex>
          <v-flex xs1 class="ml-5">
            <v-select
              :items="ranks"
              v-model="tasks[index - 1].rank"
              :hint="'Ранг'"
              persistent-hint
              return-object
              single-line>
              </v-select>
          </v-flex>
          <kns-need-container
            @selectedAction="sel_kns"
            :kns="cur_kns">
          </kns-need-container>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-pagination
          v-model="index"
          :length="tasks.length"
          :total-visible="7"
          circle>
        </v-pagination>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    <v-tooltip bottom>
      <v-btn block slot="activator" color="primary" @click="add_task">
        <v-icon dark>add</v-icon>
      </v-btn>
      <span>Добавить задачу</span>
    </v-tooltip>
  </v-layout>
</template>

<script>
import KSelector from './KSelector'
import KNdContainer from './KNeedContainer'

export default {
  components: {
    'kns-sel-container': KSelector,
    'kns-need-container': KNdContainer
  },
  data () {
    return {
      ranks: [0, 1, 2, 3],
      index: 1, // Индексация с единицы, для массивов надо делать -1
      cur_kns: [], // Массива знаний с оценками для текущей задачи по index
      tasks: [this.default_task()]
    }
  },
  watch: {
    index (value) {
      // В случае, если индекс вываливает за дозволенные границы
      if (value < 1 || value > this.tasks.length) {
        value < 1 ? this.index = 1 : this.index = this.tasks.length
      }
      // Установка текущего массива знаний
      this.cur_kns = this.tasks[value - 1].need
    }
  },
  methods: {
    add_task () {
      this.index++
      this.tasks.push(this.default_task())
    },
    default_task () {
      return {
        name: '',
        rank: 3,
        need: []
      }
    },
    delete_task () {
      this.tasks.splice(this.index - 1, 1)
      if (this.index > this.tasks.length) {
        this.index--
      }
    },
    sel_kns (items) {
      this.tasks[this.index - 1].need = items
      this.cur_kns = items
    }
  }
}
</script>
