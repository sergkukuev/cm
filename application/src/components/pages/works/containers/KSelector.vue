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
        <v-data-table
          style="width: 100%"
          :headers="headers"
          :items="kns"
          :search="search"
          v-model="selected"
          select-all
          :pagination.sync="pagination"
          :hide-headers="hide"
          hide-actions
          class="elevation-2"
          no-results-text="По данному запросу результатов не найдено"
          no-data-text="message"
        >
          <!-- Слот с заголовками -->
          <template slot="headers" slot-scope="props">
            <tr class="accent text-xs-left font-weight-medium">
              <th>
                <v-checkbox
                  :input-value="props.all"
                  color="primary"
                  :indeterminate="props.indeterminate"
                  hide-details
                  @click.native="toggle_all"
                >
                </v-checkbox>
              </th>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="['column sortable', pagination.descending ?
                  'desc' : 'asc', header.value === pagination.sortBy ?
                  'active' : '']"
                @click="sort_by(header.value)"
              >
                {{ header.text }}
                <v-icon small>arrow_upward</v-icon>
              </th>
            </tr>
          </template>
          <!-- Слот с данными -->
          <template slot="items" slot-scope="props">
            <tr :active="props.selected"
              @click="props.selected = !props.selected"
            >
              <td>
                <v-checkbox
                  color="primary"
                  :input-value="props.selected"
                  hide-details
                >
                </v-checkbox>
              </td>
              <v-tooltip right max-width="400px">
                <td slot="activator" class="py-3" style="width: 50%">
                  {{ props.item.name }}
                </td>
                <span>Оценочные уровни знания: <br></span>
                <span v-for="(mark, i) in props.item.marks" :key="i">
                  {{i + 1}} - <strong>{{ level[i] }}</strong> - {{mark}}<br>
                </span>
              </v-tooltip>
              <td>{{ props.item.ctgr }}</td>
              <td>{{ props.item.sctgr }}</td>
            </tr>
          </template>
          <template slot="no-data">
            <div class="text-xs-center">
              <v-progress-circular indeterminate color="primary" v-if="!answer">
              </v-progress-circular>
              <span v-else>{{ message }}</span>
            </div>
          </template>
        </v-data-table>
        <!-- Футер для описания и пагинации -->
        <v-toolbar slot="footer"
          class="accent elevation-2"
          dense flat
          v-if="!hide"
        >
          <span class="caption font-weight-light hidden-sm-and-down">
            * - При наведении курсора на знание отображаются оценочные уровни
          </span>
          <v-spacer></v-spacer>
          <div v-if="kns.length !== 0">
            <span class="caption font-weigth-regular">
              {{ startPage }} - {{ stopPage }} из {{ pagination.totalItems }}
              <!-- Страница {{ pagination.page }} из {{ pages }} -->
            </span>
            <v-btn
              icon
              class="mr-0"
              :disabled="pagination.page <= 1"
              @click="pagination.page--"
            >
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
            <v-btn
              icon
              class="ml-0"
              :disabled="pagination.page >= pages"
              @click="pagination.page++"
            >
              <v-icon>keyboard_arrow_right</v-icon>
            </v-btn>
          </div>
        </v-toolbar>
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
import {api} from './../../../../router/api.js'

export default {
  // wopen - событие, которое открывает данный список знаний
  // exists - набор уже включенных в задачу требуемых знаний
  props: ['exists', 'open'],
  data () {
    return {
      level: ['начальный', 'базовый', 'продвинутый', 'экспертный'],
      // Начальные значения пагинации
      pagination: {
        page: 1,
        rowsPerPage: 5,
        sortBy: 'name',
        descending: false
      },
      search: '',
      hide: true,
      answer: false,
      headers: [
        { text: 'Наименование', align: 'left', value: 'name', sortable: true },
        { text: 'Категория', value: 'ctgr', sortable: true },
        { text: 'Подкатегория', value: 'sctgr', sortable: true }
      ],
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
  computed: {
    pages () {
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    },
    startPage () {
      return (this.pagination.page - 1) * this.pagination.rowsPerPage + 1
    },
    stopPage () {
      let start = (this.pagination.page - 1) * this.pagination.rowsPerPage + 1
      let end = start + this.pagination.rowsPerPage - 1
      return end > this.pagination.totalItems ? this.pagination.totalItems : end
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
    },
    toggle_all () {
      this.selected.length ? this.selected = [] : this.selected = this.kns.slice()
    },
    sort_by (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    }
  }
}
</script>
