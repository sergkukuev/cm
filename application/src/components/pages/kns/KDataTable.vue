<template>
  <v-layout row wrap>
    <v-data-table
      style="width: 100%"
      :headers="headers"
      :items="knowledges"
      :search="search"
      :pagination.sync="pagination"
      hide-actions
      class="elevation-2"
      no-results-text="По данному запросу результатов не найдено"
      no-data-text="Нет доступных данных">
      <!-- Слот с заголовками -->
      <template slot="headers" slot-scope="props">
          <th
            class="accent text-xs-left font-weight-medium"
            v-for="header in props.headers"
            :key="header.text"
            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
            @click="sort_by(header.value, header.sortable)">
            {{ header.text }}
            <v-icon small v-if="header.text != headers[3].text">arrow_upward</v-icon>
          </th>
      </template>
      <!-- Слот с данными -->
      <template slot="items" slot-scope="props">
        <tr @click="click_item(props)">
          <td style="width: 50%">{{ props.item.name }}</td>
          <td>{{ props.item.ctgr }}</td>
          <td>{{ props.item.sctgr }}</td>
          <td class="text-xs-left" style="width: 5%">
            <v-tooltip bottom>
              <v-icon slot="activator"
                @click="$emit('editItem', props.item)"
                small class="mr-2">
                edit
              </v-icon>
              <span>Изменить</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-icon slot="activator"
                @click="$emit('removeItem', props.item)"
                small>
                delete
              </v-icon>
              <span>Удалить</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        <div class="text-xs-center">
          <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
          <span v-else>Нет доступных данных</span>
        </div>
      </template>
      <template slot="expand" slot-scope="props">
        <v-container fluid class="background font-weight-light">
          <span>
            <strong>Оценочные уровни знания: </strong>
          </span>
          <v-card class="mt-2">
            <v-card-text class="accent lighten-2">1 - {{ props.item.marks[0] }}</v-card-text>
            <v-card-text class="accent lighten-1">2 - {{ props.item.marks[1] }}</v-card-text>
            <v-card-text class="accent">3 - {{ props.item.marks[2] }}</v-card-text>
            <v-card-text class="accent darken-1">4 - {{ props.item.marks[3] }}</v-card-text>
          </v-card>
        </v-container>
      </template>
    </v-data-table>
    <!-- Футер для описания и пагинации -->
    <v-toolbar slot="footer" class="accent elevation-2" dense flat>
      <span class="caption font-weight-light">
        * - При нажатии на знание отображаются его оценочные уровни, где:
        1 - начальный,
        2 - базовый,
        3 - продвинутый,
        4 - экспертный
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
          @click="pagination.page--">
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-btn
          icon
          class="ml-0"
          :disabled="pagination.page >= pages"
          @click="pagination.page++">
          <v-icon>keyboard_arrow_right</v-icon>
        </v-btn>
      </div>
    </v-toolbar>
  </v-layout>
</template>

<script>
export default {
  props: ['knowledges', 'search', 'loading'],
  data () {
    return {
      // Начальные значения пагинации
      pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false
      },
      headers: [
        { text: 'Наименование', align: 'left', value: 'name', sortable: true },
        { text: 'Категория', value: 'ctgr', sortable: true },
        { text: 'Подкатегория', value: 'sctgr', sortable: true },
        { text: 'Действия', sortable: false }
      ],
      // TODO: Сделать подсветку
      highlight: '' // Подсветка выбранного элемента
    }
  },
  watch: {
    knowledges (value) {
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
      // props.expanded ? this.highlight = 'background' : this.highlight = ''
    },
    sort_by (column, sortable) {
      console.log(sortable)
      if (sortable) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      }
    }
  }
}
</script>
