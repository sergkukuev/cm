<template>
  <div>
    <v-toolbar class="elevation-2 mb-2">
      <v-toolbar-title>Список знаний</v-toolbar-title>
      <v-divider inset vertical class="mx-3"></v-divider>
      <v-btn color="primary" @click="dialog = true" fab small class="mx-1 elevation-1">
        <v-icon dark>add</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        lable="Поиск"
        hide-details>
      </v-text-field>
    </v-toolbar>
    <kns-dialog slot="kns-dialog"
      :default="knowledge"
      :wdialog="dialog"
      @nochangeAction="no_change"
      @saveAction="save_item"
      @cancelAction="close_dialog">
    </kns-dialog>
    <kns-table slot="kns-table"
      :knowledges="kns"
      :search="search"
      @editItem="update_item"
      @removeItem="delete_item">
    </kns-table>
    <v-toolbar slot="footer" class="mt-2 elevation-2" dense flat>
      <v-toolbar-title class="caption">
        * - При нажатии на знание отображаются его оценочные уровни, где:
        <!-- <br> &nbsp;&nbsp;&nbsp;&nbsp; -->
        1 - начальный,
        2 - базовый,
        3 - продвинутый,
        4 - экспертный
      </v-toolbar-title>
    </v-toolbar>
    <v-snackbar
      v-model="snack.activator"
      :timeout="3000"
      :color="snack.color"
      bottom
      right>
        {{ snack.text }}
      <v-btn flat @click="snack.activator = false">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import KContainer from './KContainer'
import KDialog from './KEditDlg'

import crud from './index.js'

export default {
  components: {
    'kns-dialog': KDialog,
    'kns-table': KContainer
  },
  data () {
    return {
      dialog: false,
      search: '',
      snack: {
        activator: false, // Активатор snackbar
        color: 'info',
        text: 'Здесь лежит описание последней ошибки или операции'
      },
      // Данные
      kns: [], // Все доступные знания
      knowledge: {}, // Дефолтное знание
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
      if (value >= 100 && value < 200) {
        this.render_snack('info', this.snack.text)
      } else if (value >= 200 && value < 300) {
        if (value === 201 || value === 202) {
          this.close_dialog()
        }
        this.render_snack('success', this.snack.text)
      } else if (value >= 400 && value < 600) {
        this.render_snack('error', this.snack.text)
      }
      this.code = 0 // Сброс кода в ожидание
    }
  },
  methods: {
    save_item (id, item) {
      id === undefined ? crud.save(this, item) : crud.update(this, id, item)
    },
    update_item (item) {
      this.dialog = true
      this.knowledge = item
    },
    delete_item (item) {
      confirm('Вы уверены, что хотите удалить данный элемент?') && crud.remove(this, item)
    },
    no_change () {
      this.render_snack('info', 'Нет никаких изменений, сохранение не требуется')
    },
    close_dialog () {
      this.dialog = false
      this.clear_default()
    },
    clear_default () {
      this.knowledge = {
        name: '',
        ctgr: '',
        sctgr: '',
        marks: ['', '', '', '']
      }
    },
    // Отображение snackbar
    render_snack (color, text) {
      this.snack.color = color
      this.snack.text = text
      this.snack.activator = true
    }
  },
  mounted: function () {
    crud.get(this)
    this.clear_default()
  }
}
</script>
