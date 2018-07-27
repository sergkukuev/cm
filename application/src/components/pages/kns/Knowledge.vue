<template>
  <v-layout align-start wrap>
    <kns-dialog slot="kns-dialog"
      :default="knowledge"
      :wdialog="dialog"
      @nochangeAction="no_change"
      @saveAction="save_item"
      @cancelAction="close_dialog">
    </kns-dialog>
    <v-toolbar
      class="secondary elevation-2 mb-1 font-weight-light"
      extension-height
    >
      <v-toolbar-title class="title font-weight-regular">
        Список знаний
      </v-toolbar-title>
      <v-divider vertical  class="ml-3"></v-divider>
      <v-tooltip bottom>
        <v-btn slot="activator" @click="dialog = true" icon class="ml-2">
          <v-icon>add</v-icon>
        </v-btn>
        <span>Добавить</span>
      </v-tooltip>
      <!-- <v-alert :value="alert" color="primary" outline icon="priority_high">
        {{ snack.text }}
      </v-alert> -->
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Поиск"
        hide-details>
      </v-text-field>
    </v-toolbar>
    <kns-table slot="kns-table"
      :knowledges="kns"
      :loading="loading"
      :search="search"
      @editItem="update_item"
      @removeItem="delete_item">
    </kns-table>
    <v-snackbar
      v-model="snack.activator"
      :timeout="snack.timer"
      :color="snack.color"
      bottom
      right>
        {{ snack.text }}
      <v-btn flat @click="snack.activator = false">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import KContainer from './KDataTable'
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
      alert: false,
      loading: true, // Статус загрузки всех элементов
      snack: {
        activator: false, // Активатор snackbar
        color: 'info',
        text: 'Здесь лежит описание последней ошибки или операции',
        timer: 5000
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
        this.loading = false
        this.alert = true
        this.render_snack('info', this.snack.text)
      } else if (value >= 200 && value < 300) {
        if (value === 201 || value === 202) {
          this.close_dialog()
        }
        this.loading = false
        this.alert = false
        this.render_snack('success', this.snack.text)
      } else if (value >= 400 && value < 600) {
        this.loading = false
        this.alert = true
        this.render_snack('error', this.snack.text)
      }
      this.code = 0 // Сброс кода в ожидание
    },
    alert (value) {
      if (value) {
        // TODO: Сделать таймер сброса
      }
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

<style>
  .toolbar {
    height: 200px;
  }
</style>
