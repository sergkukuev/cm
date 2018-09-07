<template>
  <v-layout fill-height column>
    <v-data-table
      style="width: 100%"
      :headers="headers"
      :items="knowledges"
      :search="search"
      v-model="selected"
      select-all
      :pagination.sync="pagination"
      hide-actions
      class="elevation-2"
      no-results-text="По данному запросу результатов не найдено"
      no-data-text="Нет доступных данных"
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
            :class="header_class(header.value)"
            @click="sort_by(header.value, header.sortable)"
          >
            {{ header.text }}
            <v-icon small>arrow_upward</v-icon>
          </th>
        </tr>
      </template>
      <!-- Слот с данными -->
      <template slot="items" slot-scope="props">
        <tr :active="props.selected"
          @click="click_item(props)"
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
          <td class="hidden-xs-only">{{ props.item.ctgr }}</td>
          <td class="hidden-sm-and-down">{{ props.item.sctgr }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <div class="text-xs-center">
          <v-progress-circular indeterminate color="primary" v-if="!loading">
          </v-progress-circular>
          <span v-else>Нет доступных данных</span>
        </div>
      </template>
    </v-data-table>
    <!-- Футер для описания и пагинации -->
    <v-toolbar slot="footer"
      class="accent elevation-2"
      dense flat
    >
      <span class="caption font-weight-light hidden-sm-and-down">
        * - При наведении курсора на знание отображаются оценочные уровни
      </span>
      <v-spacer></v-spacer>
      <div v-if="knowledges.length !== 0">
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
export default {
  props: ['knowledges', 'exists', 'search', 'loading'],
  data () {
    return {
      // Начальные значения пагинации
      pagination: {
        page: 1,
        rowsPerPage: 5,
        sortBy: 'name',
        descending: false
      },
      level: ['начальный', 'базовый', 'продвинутый', 'экспертный'],
      selected: [], // Выбранные знания
      // Заголовки
      headers: [
        { text: 'Наименование', align: 'left', value: 'name', sortable: true },
        { text: 'Категория', value: 'ctgr', sortable: true },
        { text: 'Подкатегория', value: 'sctgr', sortable: true }
      ]
    }
  },
  watch: {
    knowledges (value) {
      this.pagination.totalItems = value.length
    },
    selected (value) {
      this.$emit('A-selected', value)
    },
    exists (value) {
      if (this.exists !== undefined) {
        this.selected = value.slice()
      }
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
      props.selected = !props.selected
    },
    toggle_all () {
      this.selected.length ? this.selected = [] : this.selected = this.knowledges.slice()
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
      if (value === 'ctgr') {
        result.push('hidden-xs-only')
      } else if (value === 'sctgr') {
        result.push('hidden-sm-and-down')
      }
      return result
    }
  }
}
</script>
