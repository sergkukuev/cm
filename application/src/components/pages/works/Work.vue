<template>
  <v-layout align-start wrap>
    <!-- Диалог для изменения и добавления направлений -->
    <works-dialog slot="works-dialog"
      :wdialog="dialog"
      :default="work"
      @nochangeAction="no_change"
      @saveAction="save_item"
      @cancelAction="close_dialog"
    >
    </works-dialog>
    <!-- Шапка страницы -->
    <v-toolbar
      class="secondary elevation-2 mb-1 font-weight-light"
    >
      <v-toolbar-title class="title font-weight-regular">
        Список направлений
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
        prepend-inner-icon="search"
        clearable
        solo
        background-color="white"
        label="Поиск"
        hide-details
      >
      </v-text-field>
    </v-toolbar>
    <!-- Таблица с данными -->
    <works-table slot="works-table"
      :works="works"
      :loading="loading"
      :search="search"
      @editItem="update_item"
      @removeItem="delete_item"
    >
    </works-table>
    <!-- Snackbar -->
    <v-snackbar
      v-model="snack.activator"
      :timeout="snack.timer"
      :color="snack.color"
      bottom
      right
    >
      {{ snack.text }}
      <v-btn flat @click="snack.activator = false">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import crud from './index.js'
import WorkTable from './containers/WDataTable'
import WorkDialog from './WEditDlg'

export default {
  components: {
    'works-dialog': WorkDialog,
    'works-table': WorkTable
  },
  data () {
    return {
      dialog: false,
      search: '',
      loading: true, // Статус загрузки
      snack: {
        activator: false, // Активатор snackbar
        color: 'info',
        text: 'Здесь лежит описание последней ошибки или операции',
        timer: 5000
      },
      // Данные
      works: [], // Все доступные знания
      work: {}, // Дефолтное значение
      code: 0 // Код 0 - состояние ожидания действий
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
        this.render_snack('info', this.snack.text)
      } else if (value >= 200 && value < 300) {
        // Ресурс создан или обновлен
        if (value === 201 || value === 202) {
          this.close_dialog()
        }
        this.loading = false
        this.render_snack('success', this.snack.text)
      } else if (value >= 400 && value < 600) {
        this.loading = false
        this.render_snack('error', this.snack.text)
      }
      this.code = 0 // Сброс кода в ожидание
    }
  },
  methods: {
    save_item (work) {
      crud.save(this, crud.format(work))
    },
    update_item (item) {
      this.dialog = true
      this.work = item
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
      this.work = {
        name: '',
        tasks: []
      }
    },
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
