<template>
  <v-layout justify-space-around column>
    <v-card>
      <v-card-title class="title accent elevation-2 font-weight-regular">
        <span>
          Список доступных знаний
        </span>
        <v-spacer></v-spacer>
        <v-text-field
          class="mb-2 mt-1"
          v-model="search"
          append-icon="search"
          label="Поиск"
          hide-details
        >
        </v-text-field>
      </v-card-title>
      <v-card-text>
        <kns-selector>
        </kns-selector>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="transparent text--primary font-weight-regular elevation-0"
          @click="$emit('cancelAction')"
        >
          Отмена
        </v-btn>
        <v-btn class="accent text--primary font-weight-regular"
          @click="$emit('selectedAction', selected)"
        >
          Выбрать
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
import {api} from './../../../../../api'
import Selector from './../../../../tables/KnsSelector'

export default {
  // wopen - событие, которое открывает данный список знаний
  // exists - набор уже включенных в задачу требуемых знаний
  props: ['exists', 'open'],
  components: {
    'kns-selector': Selector
  },
  data () {
    return {
      level: ['начальный', 'базовый', 'продвинутый', 'экспертный'],
      search: '',
      hide: true,
      answer: false,
      message: 'Нет доступных данных',
      selected: [], // Выбранные знания
      kns: [] // Все знания
    }
  },
  watch: {
    open (value) {
      // Сброс
      this.answer = false
      this.message = 'Нет доступных данных'
      this.hide = true
      this.selected = this.kns = []

      if (value) {
        this.get() // Получение списка от сервера
        if (this.exists !== undefined) {
          this.selected = this.exists.slice()
        }
      }
    },
    kns (value) {
      this.pagination.totalItems = value.length
    }
  },
  methods: {
    // Получение всего списка знаний от сервера
    get () {
      let path = '/kns'
      api.get(path).then((res) => {
        this.kns = res.data.map(function (knowledge) {
          let value = {
            value: 1
          }
          knowledge['mark'] = value // Добавляем новое поле под оценку
          return knowledge
        })
        this.answer = true
        this.kns.length === 0 || this.kns.length === undefined ? this.hide = true : this.hide = false
      }, (err) => {
        console.log(err.response.data)
        this.message = err.response.data.description.message
        this.answer = true
      })
    }
  }
}
</script>
