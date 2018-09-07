<!-- Компонент: таблица всех существующих направлений. Содержит клавиши действий -->
<template>
  <v-layout fill-height column>
    <v-data-table
      style="width: 100%"
      :headers="headers"
      :items="works"
      :search="search"
      :pagination.sync="pagination"
      hide-actions
      class="elevation-2"
      no-results-text="По данному запросу результатов не найдено"
      no-data-text="Нет доступных данных"
    >
      <!-- Слот с заголовками -->
      <template slot="headers" slot-scope="props">
        <th
          class="accent text-xs-left font-weight-medium"
          v-for="header in props.headers"
          :key="header.text"
          :class="header_class(header.value)"
          @click="sort_by(header.value, header.sortable)"
        >
          {{ header.text }}
          <v-icon small v-if="header.text != headers[2].text">
            arrow_upward
          </v-icon>
        </th>
      </template>
      <!-- Слот с данными -->
      <template slot="items" slot-scope="props">
        <tr @click="click_item(props)" :class="props.expanded ? 'grey lighten-3' : ''">
          <td style="width: 90%">{{ props.item.name }}</td>
          <td class="hidden-xs-only">{{ props.item.tasks.length }}</td>
          <td class="text-xs-left" style="width: 5%">
            <v-icon slot="activator"
                @click="$emit('I-edit', props.item)"
                small class="mr-2"
              >
                edit
              </v-icon>
              <v-icon slot="activator"
                @click="$emit('I-remove', props.item)"
                small
              >
                delete
              </v-icon>
            <!-- <v-tooltip bottom>
              <v-icon slot="activator"
                @click="$emit('I-edit', props.item)"
                small class="mr-2"
              >
                edit
              </v-icon>
              <span>Изменить</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-icon slot="activator"
                @click="$emit('I-remove', props.item)"
                small
              >
                delete
              </v-icon>
              <span>Удалить</span>
            </v-tooltip> -->
          </td>
        </tr>
      </template>
      <!-- Слот отсутствия данных -->
      <template slot="no-data">
        <div class="text-xs-center">
          <v-progress-circular indeterminate color="primary" v-if="loading">
          </v-progress-circular>
          <span v-else>Нет доступных данных</span>
        </div>
      </template>
      <!-- Слот расширения -->
      <template slot="expand" slot-scope="props">
        <v-layout row class="background font-weight-light pa-4">
          <v-flex xs6>
            <!-- Контейнер списка задач направления -->
            <v-card class="mr-1">
              <v-card-title
                class="accent font-weight-medium"
              >
                Задачи направления :
              </v-card-title>
              <v-card-text
                fluid
                id="scroll-target"
                style="height: 250px"
                class="scroll-y"
              >
                <tow-table
                  :tasks="props.item.tasks"
                  @A-selected="selected_item"
                >
                </tow-table>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs6>
            <!-- Контейнер для списка знаний выбранной задачи -->
            <v-card class="ml-1">
              <v-card-title
                class="accent font-weight-medium"
              >
                Требуемые знания
                <span v-if="selected != -1">
                  &nbsp;для задачи №{{ selected  + 1}}&nbsp;
                </span>
                :
                <v-spacer></v-spacer>
                <!-- Отображение ошибки обработки знаний -->
                <v-tooltip bottom class="mr-2" v-show="kns_errors != 0">
                  <v-icon slot="activator" color="error" left>error</v-icon>
                  <span>Кол-во непрочитанных знаний: {{ kns_errors }}</span>
                </v-tooltip>
              </v-card-title>
              <v-card-text
                v-if="selected != -1"
                fluid
                id="scroll-target"
                style="height: 250px"
                class="scroll-y"
              >
                <kot-table
                  :kns_id="props.item.tasks[selected].need"
                  :errors="kns_errors"
                  @E-inc="kns_errors++"
                  @E-reset="kns_errors = 0"
                >
                </kot-table>
              </v-card-text>
              <v-card-text v-else style="height: 250px"
                class="text-xs-center font-weight-regular"
              >
                  Задача не выбрана
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </template>
    </v-data-table>
    <!-- Футер для описания и пагинации -->
    <v-toolbar slot="footer" class="accent elevation-2" flat>
      <span class="caption font-weight-light hidden-sm-and-down">
        * - При нажатии на направление отображаются его задачи
      </span>
      <v-spacer></v-spacer>
      <div v-if="works.length !== 0">
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
  </v-layout>
</template>

<script>
import TasksOfWorks from './TasksOfWorks'
import KnsOfTasks from './KnsOfTasks'

export default {
  props: ['works', 'search', 'loading'],
  components: {
    'tow-table': TasksOfWorks,
    'kot-table': KnsOfTasks
  },
  data () {
    return {
      // Начальные значения пагинации
      pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false
      },
      selected: -1, // Индекс выбранной задачи
      kns_errors: 0, // Количество ошибок при считывании знаний за один цикл
      headers: [
        { text: 'Наименование', value: 'name', sortable: true },
        { text: 'Кол-во задач', value: 'tasks', sortable: true },
        { text: 'Действия', sortable: false }
      ]
    }
  },
  watch: {
    works (value) {
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
    click_item (props) {
      props.expanded = !props.expanded
      this.selected = -1 // Сброс индекса выбранной задачи
      this.kns_errors = 0 // Сброс количества ошибок знаний
    },
    selected_item (index) {
      this.selected = index
      // Сброс количества ошибок знаний
      if (this.selected === -1) {
        this.kns_errors = 0
      }
    },
    sort_by (column, sortable) {
      if (sortable) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      }
    },
    header_class (value) {
      let result = []
      result.push('column sortable')
      this.pagination.descending ? result.push('desc') : result.push('asc')
      if (value === this.pagination.sortBy) {
        result.push('active')
      }
      // Установка дополнительных параметров класса
      if (value === 'tasks') {
        result.push('hidden-xs-only')
      }
      return result
    }
  }
}
</script>
