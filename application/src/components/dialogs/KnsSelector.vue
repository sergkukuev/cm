<!-- Диалог выбора знаний из всего списка -->
<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-layout justify-space-around column>
      <v-card>
        <v-card-title class="title accent elevation-2 font-weight-regular">
          <span>
            Список доступных знаний
          </span>
          <v-spacer></v-spacer>
          <!-- Поиск -->
          <v-text-field
            v-model="search"
            prepend-inner-icon="search"
            flat
            solo
            background-color="transparent"
            label="Поиск"
            hide-details
          >
          </v-text-field>
          <!-- Отображение ошибок -->
          <v-tooltip bottom class="mr-2" v-show="last.code >= 400">
            <v-icon slot="activator" color="error" medium>error</v-icon>
            <span>{{ last.text }}</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text>
          <kns-selector
            :knowledges="kns"
            :exists="exists"
            :search="search"
            :loading="loading"
            @A-selected="get_selected"
          >
          </kns-selector>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="transparent text--primary font-weight-regular elevation-0"
            @click="$emit('A-cancel')"
          >
            Отмена
          </v-btn>
          <v-btn class="accent text--primary font-weight-regular"
            @click="$emit('A-selected', selected)"
          >
            Выбрать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-dialog>
</template>

<script>
import {get} from '@/api/knowledges'
import Selector from '@/components/tables/KnsSelector'

export default {
  // exists - набор уже включенных в задачу требуемых знаний
  props: ['wdialog', 'exists'],
  components: {
    'kns-selector': Selector
  },
  data () {
    return {
      dialog: false,
      loading: true, // Статус загрузки
      search: '',
      selected: [], // Выбранные знания
      kns: [], // Все знания
      // Параметры последнего ответа
      last: {
        text: 'Здесь лежит описание последней ошибки или операции',
        code: 0 // Код последней операции
      },
      code: 0 // Код 0 - состояние ожидания ввода
    }
  },
  watch: {
    code (value) {
      // 100 - 199 Информационные
      // 200 - 299 Успешные
      // 300- 399 Перенаправление
      // 400 - 499 Ошибка клиента
      // 500 - 599 Ошибка сервера
      if (value !== 0) {
        this.loading = false // Пришел ответ от сервера
        this.last.code = value
      }
      if (value >= 100 && value < 200) {
        console.log('Код: ' + value + ' Описание: ' + this.last.text)
      } else if (value === 200) {
        // Знания пришли, надо бы расставить им значения оценок по дефолту
        this.kns = this.kns.map(function (knowledge) {
          let value = {
            value: 1
          }
          knowledge['mark'] = value // Добавляем новое поле под оценку
          return knowledge
        })
      } else if (value >= 400 && value < 600) {
        console.log('Код: ' + value + ' Описание: ' + this.last.text)
      }
      this.code = 0 // Сброс кода в ожидание
    },
    wdialog (value) {
      this.dialog = value
      if (value) {
        this.get_kns() // Получение списка от сервера
      }
    }
  },
  methods: {
    get_kns () {
      this.loading = true
      get(this)
    },
    // Считывание выбранных знаний
    get_selected (items) {
      this.selected = items
    }
  }
}
</script>
