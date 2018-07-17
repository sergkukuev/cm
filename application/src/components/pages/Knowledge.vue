<template>
  <div>
    <v-toolbar class="elevation-2">
      <v-toolbar-title>Список знаний</v-toolbar-title>
      <v-divider inset vertical class="mx-3"></v-divider>
      <!-- Диалог для редактирования и добавления знания -->
      <div class="text-xs-center">
        <v-dialog v-model="dialog" max-width="800px" persistent>
        <v-btn slot="activator" color="primary" outline fab small class="mx-1">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-card>
          <v-card-title class="headline primary white--text" primary-title>
            Добавление знания
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="edit_kn.name"
              label="Наименование">
            </v-text-field>
            <v-flex xs4>
              <v-switch v-model="flag_ctgr" label="Категория"></v-switch>
            </v-flex>
            <v-layout row justify-space-between>
              <v-flex xs6>
                <v-text-field
                  v-if="flag_ctgr"
                  v-model="edit_kn.ctgr"
                  label="Категория">
                </v-text-field>
              </v-flex>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <v-flex xs6>
                <v-text-field
                  v-if="flag_ctgr"
                  v-model="edit_kn.sctgr"
                  label="Подкатегория">
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row justify-space-between>
              <v-flex xs6>
                <v-textarea
                  v-model="edit_kn.marks[0]"
                  outline
                  name="tx-area-1"
                  label="1 - Начальный уровень">
                </v-textarea>
              </v-flex>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <v-flex xs6>
                <v-textarea
                  v-model="edit_kn.marks[1]"
                  outline
                  name="tx-area-2"
                  label="2 - Базовый уровень">
                </v-textarea>
              </v-flex>
            </v-layout>
            <v-layout row justify-space-between>
              <v-flex xs6>
                <v-textarea
                  v-model="edit_kn.marks[2]"
                  outline
                  name="tx-area-3"
                  label="3 - Продвинутый уровень">
                </v-textarea>
              </v-flex>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <v-flex xs6>
                <v-textarea
                  v-model="edit_kn.marks[3]"
                  outline
                  name="tx-area-4"
                  label="4 - Экспертный уровень">
                </v-textarea>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="cancel_action" round>Отмена</v-btn>
            <v-btn color="primary" round @click="save_action">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      </div>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        lable="Поиск"
        single-line
        hide-details>
      </v-text-field>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="kns"
      :search="search"
      class="elevation-2"
      no-results-text="По данному запросу результатов не найдено"
      no-data-text="Нет доступных данных">
      <!-- Слот с данными -->
      <template slot="items" slot-scope="props">
        <tr @click="props.expanded = !props.expanded">
          <td style="width: 50%">{{ props.item.name }}</td>
          <td>{{ props.item.ctgr }}</td>
          <td>{{ props.item.sctgr }}</td>
          <td style="width: 5%">
            <v-icon small @click="update_action(props.item)" class="mr-2">edit</v-icon>
            <v-icon small @click="delete_action(props.item)">delete</v-icon>
          </td>
        </tr>
      </template>
      <template slot="expand" slot-scope="props">
        <v-container fluid>
          <v-card>
            <v-card-text class="primary lighten-5">1 - {{ props.item.marks[0] }}</v-card-text>
            <v-card-text class="primary lighten-4">2 - {{ props.item.marks[1] }}</v-card-text>
            <v-card-text class="primary lighten-3">3 - {{ props.item.marks[2] }}</v-card-text>
            <v-card-text class="primary lighten-2">4 - {{ props.item.marks[3] }}</v-card-text>
          </v-card>
        </v-container>
      </template>
      <!-- Выдача алерта, когда данные пустые -->
      <!-- <template slot="no-data">
        <v-layout align-center justify-center>
            Нет доступных данных
        </v-layout>
      </template> -->
      <!-- Вывести в футер напоминание о том, что при нажатии на элемент выпадет список оценок
      <template slot="footer" primary>
        <td colspan="100%">
          <small>При нажатии на знание, будут показаны все его оценки</small>
        </td>
      </template> -->
      <template slot="pageText" slot-scope="props">
        {{ props.pageStart }}-{{props.pageStop }} из {{ props.itemsLength}}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {api} from './../../router/api.js'
export default {
  data () {
    return {
      // Взаимодействие с интерфейсом
      flag_ctgr: false,
      dialog: false,
      search: '',
      headers: [
        { text: 'Наименование', align: 'left', value: 'name' },
        { text: 'Категория', value: 'ctgr' },
        { text: 'Подкатегория', value: 'sctgr' },
        { text: 'Действия', sortable: false }
      ],
      // Данные
      kns: [],
      // Измененное знание
      edit_kn: {
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
      code: 0
    }
  },
  watch: {
    dialog (value) {
      value || this.close_dialog()
    },
    created () {
      this.get_kns()
    }
  },
  methods: {
    // Взаимодействие с API
    get_kns () {
      let path = '/kns'
      api.get(path).then((response) => {
        this.kns = response.data
        this.code = response.status
      }, (err) => {
        console.log(err.response.data)
        this.code = err.response.status
      })
    },
    delete_kn (kn) {
      let path = '/kns/' + kn.id
      api.delete(path).then((response) => {
        const index = this.kns.indexOf(kn)
        this.kns.splice(index, 1) // Удаляем из массива, чтобы не делать дополнительный запрос на изменения в БД
      }, (err) => {
        console.log(err.response.data)
        this.code = err.response.status
      })
    },
    save_kn (data) {
      let path = '/kns/create'
      api.post(path, data).then((response) => {
        this.close_dialog()
        this.clear_data()
        this.code = response.status
        this.kns.push(response.data)
      }, (err) => {
        console.log(err.response.data)
        this.code = err.response.status
      })
    },
    update_kn (id, data) {
      let path = '/kns/' + id
      // Пустые данные
      api.put(path, data).then((response) => {
        this.close_dialog()
        this.clear_data()
        this.code = response.status
      }, (err) => {
        console.log(err.response.data)
        this.code = err.response.status
      })
      this.clear_data()
    },
    // Обработка данных
    dublicate_data (item) {
      let data = {
        id: item.id,
        name: item.name,
        ctgr: item.ctgr,
        sctgr: item.sctgr,
        marks: [item.marks[0], item.marks[1], item.marks[2], item.marks[3]]
      }
      return data
    },
    copy_data (from, to) {
      to.name = from.name
      to.ctgr = from.ctgr
      to.sctgr = from.sctgr
      to.marks[0] = from.marks[0]
      to.marks[1] = from.marks[1]
      to.marks[2] = from.marks[2]
      to.marks[3] = from.marks[3]
    },
    format_data (kn) {
      let data = {}
      if (kn.name !== this.default_kn.name) {
        data['name'] = kn.name
      }
      if (this.flag_ctgr) {
        if (kn.ctgr !== this.default_kn.ctgr) {
          data['ctgr'] = kn.ctgr
        }
        if (kn.sctgr !== this.default_kn.sctgr) {
          data['sctgr'] = kn.sctgr
        }
      } else {
        data['ctgr'] = '-'
        data['sctgr'] = '-'
      }
      let flMarks = false
      for (let i = 0; i < kn.marks.length; i++) {
        if (kn.marks[i] !== this.default_kn.marks[i]) {
          flMarks = true
        }
        if (kn.marks[i] === '') {
          flMarks = false
          break
        }
      }
      if (flMarks) {
        data['marks'] = kn.marks
      }
      return data
    },
    clear_data () {
      this.edit_kn = {
        name: '',
        ctgr: '',
        sctgr: '',
        marks: ['', '', '', '']
      }
      this.default_kn = this.dublicate_data(this.edit_kn)
    },
    // Взаимодействие с интерфейсом
    save_action () {
      let item = this.edit_kn
      item.id === undefined ? this.save_kn(this.format_data(item)) : this.update_kn(item.id, this.format_data(item))
    },
    cancel_action () {
      this.copy_data(this.default_kn, this.edit_kn)
      this.close_dialog()
    },
    update_action (item) {
      if (item.ctgr !== '-' || item.sctgr !== '-') {
        this.flag_ctgr = true
      }
      this.dialog = true
      this.default_kn = this.dublicate_data(item)
      this.edit_kn = item
    },
    delete_action (item) {
      confirm('Вы уверены, что хотите удалить данный элемент?') && this.delete_kn(item)
    },
    close_dialog () {
      this.dialog = false
    }
  },
  mounted: function () {
    this.get_kns()
  }
}
</script>
