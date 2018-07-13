<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Список знаний</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">Добавить</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ form_title }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="edt_kn.name" label="Наименование"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="edt_kn.ctgr" label="Категория"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="edt_kn.sctgr" label="Подкатегория"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="edt_kn.marks[0]" label="Оценка1"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="edt_kn.marks[1]" label="Оценка2"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="edt_kn.marks[2]" label="Оценка3"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="edt_kn.marks[3]" label="Оценка4"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Отмена</v-btn>
            <v-btn color="blue darken-1" flat @click.native="close">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <!--<v-text-field
      v-model="search"
      append-icon="search"
      lable="Поиск"
      black--text
      single-line
      hide-details>
    </v-text-field> -->
    <v-data-table
      :headers="headers"
      :items="kns"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      sort-icon="mdi-menu-down"
      class="elevation-l">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.category }}</td>
        <td class="text-xs-right">{{ props.item.sub_category }}</td>
        <td class="text-xs-right">{{ props.item.marks }}</td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="update_kn(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          {{ err_msg }} ({{ status }})
        </v-alert>
      </template>
      <!-- Параметры на рассмотрении
        :pagination.sync="pagination" Внешняя пагинация
      -->
      <!-- <div class="text-xs-center pt-2">
        <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
      </div> -->
    </v-data-table>
  </div>
</template>

<script>
import {API} from './../../router/api.js'

export default {
  data () {
    return {
      headers: [
        { text: 'Наименование параметра' },
        { text: 'Категория' },
        { text: 'Подкатегория' },
        { text: 'Оценки' },
        { text: 'Действия', sortable: false }
      ],
      kns: [],
      edt_index: -1,
      edt_kn: {
        name: '',
        ctgr: '',
        sctgr: '',
        marks: ['', '', '', '']
      },
      default_kn: {
        name: '',
        ctgr: '',
        sctgr: '',
        marks: ['', '', '', '']
      },
      pagination: {},
      search: '',
      err_msg: '',
      status: 0
    }
  },
  computed: {
    form_title () {
      return this.edt_index === -1 ? 'Добавление' : 'Редактирование'
    },
    // Определиться с пагинацией (через сервер или гуи)
    pages () {
      if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) {
        return 0
      }
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  },
  watch: {
    dialog (value) {
      value || this.close()
    },
    created () {
      this.get_kns()
    }
  },
  methods: {
    // CRUD операции
    save_kn () {
      let path = '/kns/create'
      API.post(path).then((response) => {
        this.default_kn = response.data
        this.status = response.status
      }, (err) => {
        this.err_msg = err.response.data.description
        this.status = err.response.status
      })
    },
    get_kns () {
      let path = '/kns'
      API.get(path).then((response) => {
        this.kns = response.data
        this.status = response.status
      }, (err) => {
        this.err_msg = err.response.data.description
        this.status = err.response.status
      })
    },
    update_kn (kn) {
      let path = '/kns/' + kn.id
      API.put(path, kn).then((response) => {
        this.default_kn = response.data
        this.status = response.status
      }, (err) => {
        this.err_msg = err.response.data.description
        this.status = err.response.status
      })
    },
    delete_kn (id) {
      let path = '/kns' + id
      API.delete(path).then((response) => {
        this.default_kn = response.data
        this.status = response.status
      }, (err) => {
        this.err_msg = err.response.data.description
        this.status = err.response.status
      })
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.edt_kn = Object.assign({}, this.delete_kn)
        this.edt_index = -1
      }, 300)
    },
    save () {
      if (this.edt_index > -1) {
        Object.assign(this.kns[this.edt_index], this.edt_kn)
      } else {
        this.save_kn(this.edt_kn)
      }
    }
  },
  mounted: function () {
    this.get_kns()
  }
}
</script>
