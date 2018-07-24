<template>
  <v-layout justify-space-around column>
    <v-toolbar slot="header" class="elevation-1">
      <v-toolbar-title>Список доступных знаний:</v-toolbar-title>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      v-model="selected"
      select-all
      :items="kns"
      :hide-headers="hide"
      :hide-actions="hide"
      :pagination.sync="pagination"
      class="elevation-2"
      no-results-text="По данному запросу результатов не найдено"
      :no-data-text="msg">
      <template slot="headers" slot-scope="props">
        <tr>
          <th>
            <v-checkbox
              :input-value="props.all"
              :indeterminate="props.indeterminate"
              hide-details
              @click.native="toggle_all">
            </v-checkbox>
          </th>
          <th
            v-for="header in props.headers"
            :key="header.text"
            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
            @click="change_sort(header.value)">
            <v-icon small>arrow_upward</v-icon>
            {{ header.text }}
          </th>
        </tr>
      </template>
      <!-- Слот с данными -->
      <template slot="items" slot-scope="props">
        <tr :active="props.selected" @click="props.selected = !props.selected">
          <td>
            <v-checkbox
              :input-value="props.selected"
              hide-details>
            </v-checkbox>
          </td>
          <v-tooltip right max-width="400px">
            <td slot="activator" class="py-3">{{ props.item.name }}</td>
            <span>Оценочные уровни знания: <br></span>
            <span v-for="(mark, i) in props.item.marks" :key="i">{{i + 1}} - {{mark}}<br></span>
          </v-tooltip>
          <td class="text-xs-center">{{ props.item.ctgr }}</td>
          <td class="text-xs-center">{{ props.item.sctgr }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <div class="text-xs-center">
          <v-progress-circular indeterminate color="primary" v-if="!answer"></v-progress-circular>
          <span v-else>{{ msg }}</span>
        </div>
      </template>
      <template slot="pageText" slot-scope="props">
        {{ props.pageStart }}-{{props.pageStop }} из {{ props.itemsLength}}
      </template>
    </v-data-table>
    <v-toolbar slot="footer" class="elevation-0">
      <v-flex xs8>
        <v-toolbar-title class="caption" v-if="!hide">
          * - Оценочные уровни отображаются при наведении курсора на наименование
        </v-toolbar-title>
      </v-flex>
      <v-btn flat round color="primary" @click="$emit('cancelAction')">Отмена</v-btn>
      <v-btn block round color="primary" @click="$emit('selectedAction', selected)">Выбрать</v-btn>
    </v-toolbar>
  </v-layout>
</template>

<script>
import {api} from './../../../router/api.js'

export default {
  // wopen - событие, которое открывает данный список знаний
  // exists - набор уже включенных в задачу требуемых знаний
  props: ['exists', 'open'],
  data () {
    return {
      hide: true,
      answer: false,
      headers: [
        { text: 'Наименование', align: 'left', value: 'name' },
        { text: 'Категория', value: 'ctgr' },
        { text: 'Подкатегория', value: 'sctgr' }
      ],
      pagination: {
        sortBy: 'name'
      },
      msg: 'Нет доступных данных',
      selected: [], // Выбранные знания
      kns: [] // Все знания
    }
  },
  watch: {
    open (value) {
      // Сброс
      this.answer = false
      this.msg = 'Нет доступных данных'
      this.hide = true
      this.selected = this.kns = []

      if (value) {
        this.get() // Получение списка от сервера
        if (this.exists !== undefined) {
          this.selected = this.exists.slice()
        }
      }
    }
  },
  methods: {
    // Получение всего списка знаний от сервера
    get () {
      let path = '/kns'
      api.get(path).then((res) => {
        this.kns = res.data.map(function (knowledge) {
          knowledge['mark'] = 1 // Добавляем новое поле под оценку
          return knowledge
        })
        this.answer = true
        this.kns.length === 0 || this.kns.length === undefined ? this.hide = true : this.hide = false
      }, (err) => {
        console.log(err.response.data)
        this.msg = err.response.data.description.message
        this.answer = true
      })
    },
    toggle_all () {
      this.selected.length ? this.selected = [] : this.selected = this.kns.slice()
    },
    change_sort (column) {
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
