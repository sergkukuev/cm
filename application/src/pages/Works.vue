<!-- Страница всех доступных направлений -->
<template>
  <v-layout align-start wrap>
    <!-- Диалог для изменения и добавления направлений -->
    <works-dialog slot="works-dialog"
      :wdialog="dialog"
      :default="work"
      @A-nochange="no_change"
      @A-save="save_item"
      @A-cancel="close_dialog"
    >
    </works-dialog>
    <!-- Шапка страницы -->
    <v-toolbar class="secondary elevation-2 mb-1 font-weight-light" height=60>
      <v-toolbar-title
        :class="['title', 'font-weight-regular',
          search.activator ? 'hidden-xs-only' : '']"
      >
        Направления
      </v-toolbar-title>
      <v-spacer :class="search.activator ? 'hidden-xs-only' : ''"></v-spacer>
      <!-- Поиск -->
      <v-text-field
        v-show="search.activator"
        v-model="search.field"
        prepend-inner-icon="search"
        flat
        solo
        background-color="transparent"
        label="Поиск"
        hide-details
      >
      </v-text-field>
      <v-btn v-show="search.activator"
        @click="search_reload"
        color="red darken-1"
        flat
        icon
        left
      >
        <v-icon>clear</v-icon>
      </v-btn>
      <!-- <v-divider vertical  class="ml-3 mr-3"></v-divider> -->
      <!-- Отображение ошибок -->
      <v-tooltip bottom class="mr-2" v-show="last.code >= 300">
        <v-icon slot="activator" color="error" medium>error</v-icon>
        <span>{{ last.text }}</span>
      </v-tooltip>
      <!-- Кнопка дополнительных действий -->
      <more-action
        v-show="!search.activator"
        :direction="'left'"
        :position="'left'"
        :color="['black', 'secondary']"
        @A-add="dialog = true"
        @A-refresh="get_items"
        @A-search="search_reload"
      >
      </more-action>
    </v-toolbar>
    <!-- Таблица с данными -->
    <works-table slot="works-table"
      :works="works"
      :loading="loading"
      :search="search.field"
      @I-edit="update_item"
      @I-remove="delete_item"
    >
    </works-table>
    <!-- Snackbars -->
    <v-snackbar
      v-model="snack.activator"
      :timeout="snack.timer"
      :color="snack.color"
      bottom
      right
    >
      {{ last.text }}
      <v-btn flat @click="snack.activator = false">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import WorkTable from '@/components/tables/WorksView'
import WorkDialog from '@/components/dialogs/WorkEdit'
import Actions from '@/components/MoreAction'

import crud from '@/api/works'

export default {
  components: {
    'more-action': Actions,
    'works-dialog': WorkDialog,
    'works-table': WorkTable
  },
  data () {
    return {
      dialog: false,
      // Поиск
      search: {
        activator: false,
        field: ''
      },
      loading: true, // Статус загрузки
      snack: {
        activator: false, // Активатор snackbar
        color: 'info',
        timer: 5000
      },
      // Данные
      works: [], // Все доступные знания
      work: {}, // Дефолтное значение
      // Параметры последнего ответа
      last: {
        text: 'Здесь лежит описание последней ошибки или операции',
        code: 0 // Код последней операции
      },
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
      if (value !== 0) {
        this.loading = false // Пришел ответ от сервера
        this.last.code = value
      }
      if (value >= 100 && value < 200) {
        this.render_snack('info', this.last.text)
      } else if (value >= 200 && value < 300) {
        // Ресурс создан или обновлен
        if (value === 201 || value === 202) {
          this.close_dialog()
        }
        this.render_snack('success', this.last.text)
      } else if (value >= 400 && value < 600) {
        this.render_snack('error', this.last.text)
      }
      this.code = 0 // Сброс кода в ожидание
    }
  },
  methods: {
    save_item (work) {
      crud.save(this, work)
    },
    get_items () {
      this.loading = true
      crud.get(this)
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
    search_reload () {
      this.search.field = ''
      this.search.activator = !this.search.activator
    },
    clear_default () {
      this.work = {
        name: '',
        tasks: []
      }
    },
    // Отображение snackbar
    render_snack (color, text) {
      this.snack.color = color
      this.last.text = text
      this.snack.activator = true
    }
  },
  mounted: function () {
    this.get_items()
    this.clear_default()
  }
}
</script>
