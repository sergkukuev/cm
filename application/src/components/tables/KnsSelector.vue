<template>
  <v-layout fill-height column>
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
          <span v-else>{{ text }}</span>
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
  </v-layout>
</template>

<script>
export default {
  props: ['knowledges', 'selected', 'search', 'loading'],
  data () {
    return {
      // Начальные значения пагинации
      pagination: {
        page: 1,
        rowsPerPage: 5,
        sortBy: 'name',
        descending: false
      },
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
