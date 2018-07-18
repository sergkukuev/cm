<template>
  <v-data-iterator
    :items="works"
    :rows-per-page-items="rows_per_page_items"
    :pagination.sync="pagination"
    content-tag="v-layout"
    hide-actions
    row
    wrap>
    <v-toolbar slot="header" class="mb-2 elevation-2" flat>
      <v-toolbar-title>Список типовых работ</v-toolbar-title>
      <v-divider inset vertical class="mx-3"></v-divider>
      <!-- Степпер для создания новой типовой работы -->
      <v-dialog v-model="dialog" max-width="800px">
        <v-btn slot="activator" color="primary" outline fab small class="mx-1">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-stepper v-model="stepper">
          <v-stepper-header>
            <v-stepper-step :complete="stepper > 1" step="1">Основные поля</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="stepper > 2" step="2">Задачи</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">Шаг 3</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card>
                <v-card-title>Заполните основные поля работы:</v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="work.name"
                    label="Наименование">
                  </v-text-field>
                </v-card-text>
              </v-card>
              <v-btn
                color="primary"
                @click="stepper = 2">
                Далее
              </v-btn>
              <v-btn flat>Отмена</v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-card>
                <v-card-title>Добавьте задачи:</v-card-title>
                <v-card-text>
                  <v-data-table
                    :headers="h_task"
                    :items="i_task"
                    hide-actions
                    class="elevation-2"
                    no-data-text="Нет доступных данных">
                    <!-- Слот с данными -->
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.rank }}</td>
                        <td style="width: 5%">
                          <v-icon small class="mr-2">edit</v-icon>
                          <v-icon small>delete</v-icon>
                        </td>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
              <v-btn
                color="primary"
                @click="stepper = 3">
                Далее
              </v-btn>
              <v-btn flat>Отмена</v-btn>
            </v-stepper-content>
            <v-stepper-content step="3">
              <v-card
                class="mb-5"
                color="grey lighten-1"
                height="200px">
              </v-card>
              <v-btn
                color="primary"
                @click="stepper = 1">
                Создать
              </v-btn>
              <v-btn flat>Отмена</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-dialog>
    </v-toolbar>
    <v-flex xs12 slot="item" slot-scope="props">
      <v-card>
        <v-card-title class="subheading font-weight-bold">
          {{ props.item.name }}
        </v-card-title>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-tile>
            <v-list-tile-content>
              <strong> Задачи: </strong>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-for="task in props.item.tasks"
            :key="task.id">
            <v-flex xs6>
              <v-list-tile-content>
                {{ task.name }}
              </v-list-tile-content>
            </v-flex>
            <v-flex xs>
              <v-list-tile-content class="align-end">
                Ранг: {{ task.rank }}
              </v-list-tile-content>
            </v-flex>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    <v-toolbar slot="footer" class="mt-2" color="primary" dark dense flat>
      <v-toolbar-title class="subheading">Футер</v-toolbar-title>
    </v-toolbar>
  </v-data-iterator>
</template>

<script>
import {api} from './../../router/api.js'

export default {
  data () {
    return {
      // Взаимодействие с интерфейсом
      stepper: 0,
      dialog: false,
      h_task: [
        'Наименование',
        'Ранг',
        'Действия'
      ],
      i_task: [],
      work_name: '',
      search: '',
      rows_per_page_items: [1, 2, 4],
      pagination: {
        rowsPerPage: 1
      },
      // Данные
      works: [],
      work: {
        id: '',
        name: '',
        tasks: [{
          rank: 0,
          name: '',
          need: [{
            id_knowledge: '',
            mark: 0
          }]
        }]
      },
      code: 0
    }
  },
  methods: {
    // Взаимодействие с API
    get_works () {
      let path = '/works'
      api.get(path).then((response) => {
        this.works = response.data
        this.code = response.status
      }, (err) => {
        console.log(err.response.data)
        this.code = err.response.status
      })
    }
  },
  mounted: function () {
    this.get_works()
  }
}
</script>
