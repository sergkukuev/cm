<template>
  <v-layout align-start wrap>
    <!-- Диалог для изменения и добавления знаний -->
    <kns-dialog slot="kns-dialog"
      :default="knowledge"
      :wdialog="dialog"
      @nochangeAction="no_change"
      @saveAction="save_item"
      @cancelAction="close_dialog"
    >
    </kns-dialog>
    <!-- Шапка страницы -->
    <v-toolbar class="secondary elevation-2 mb-1 font-weight-light">
      <v-toolbar-title
        :class="['title', 'font-weight-regular',
          search.activator ? 'hidden-xs-only' : '']"
      >
        Знания сила, кочка могила
      </v-toolbar-title>
      <!-- Кнопки тулбара (добавить, обновить, поиск и т.д.) -->
      <v-spacer></v-spacer>
      <v-tooltip bottom class="mr-2" v-show="last_code >= 300">
        <v-icon slot="activator" color="error" medium>error</v-icon>
        <span>{{ text }}</span>
      </v-tooltip>
      <v-text-field
        v-show="search.activator"
        v-model="search.field"
        prepend-inner-icon="search"
        clearable
        solo
        background-color="white"
        label="Поиск"
        hide-details
      >
      </v-text-field>
      <!-- <v-divider vertical  class="ml-3 mr-3"></v-divider> -->
      <v-tooltip bottom>
        <v-btn slot="activator"
          @click="search.activator = !search.activator"
          icon
        >
          <v-icon v-if="search.activator">clear</v-icon>
          <v-icon v-else>search</v-icon>
        </v-btn>
        <span v-if="search.activator">Закрыть</span>
        <span v-else>Поиск</span>
      </v-tooltip>
      <!-- Кнопка действий в тулбаре -->
      <kns-action
        :direction="'left'"
        :position="'left'"
        :color="['black', 'secondary']"
        @A-add="dialog = true"
        @A-refresh="get_items"
        @A-search="$emit()"
      >
      </kns-action>
    </v-toolbar>
    <!-- Кнопка действий вне тулбара
    <kns-action v-if="$vuetify.breakpoint.xs"
        :floating="true"
        :color="'secondary'"
        :direct="'right'"
        @refreshAction="get_items"
        @addAction="dialog = true"
      >
      </kns-action> -->
    <!-- Таблица данных -->
    <kns-table slot="kns-table"
      :knowledges="kns"
      :loading="loading"
      :search="search.field"
      @editItem="update_item"
      @removeItem="delete_item"
    >
    </kns-table>
    <!-- Snackbars -->
    <v-snackbar
      v-model="snack.activator"
      :timeout="snack.timer"
      :color="snack.color"
      bottom
      right
    >
      {{ text }}
      <v-btn flat @click="snack.activator = false">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import KTable from '@/components/tables/KnsAction'
import KDialog from '@/components/dialogs/KnEdit'
import Actions from '@/components/MoreAction'

import crud from '@/api/knowledges'

export default {
  components: {
    'kns-action': Actions,
    'kns-dialog': KDialog,
    'kns-table': KTable
  },
  data () {
    return {
      dialog: false,
      search: {
        activator: false,
        field: ''
      },
      loading: true, // Статус загрузки списка знаний
      snack: {
        activator: false, // Активатор snackbar
        color: 'info',
        timer: 4000
      },
      // Данные
      kns: [], // Все доступные знания
      knowledge: {}, // Дефолтное знание
      // Параметры ответа
      text: 'Здесь лежит описание последней ошибки или операции',
      last_code: 0, // Код последней операции
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
      if (value !== 0) {
        this.loading = false // Пришел ответ от сервера
        this.last_code = value
      }
      if (value >= 100 && value < 200) {
        this.render_snack('info', this.text)
      } else if (value >= 200 && value < 300) {
        // Добавление или редактирование прошло успешно
        if (value === 201 || value === 202) {
          this.close_dialog()
        }
        this.render_snack('success', this.text)
      } else if (value >= 400 && value < 600) {
        this.render_snack('error', this.text)
      }
      this.code = 0 // Сброс кода в ожидание
    }
  },
  methods: {
    save_item (id, item) {
      id === undefined ? crud.save(this, item) : crud.update(this, id, item)
    },
    get_items () {
      this.loading = true
      crud.get(this)
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
      this.text = text
      this.snack.activator = true
    }
  },
  mounted: function () {
    this.get_items()
    this.clear_default()
  }
}
</script>

<style>
.toolbar {
    height: 1000px;
  }
</style>
