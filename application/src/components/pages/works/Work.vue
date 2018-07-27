<template>
  <v-layout row wrap>
    <v-toolbar class="secondary elevation-2 mb-1 font-weight-light">
      <v-toolbar-title class="title font-weight-regular">Список направлений</v-toolbar-title>
      <v-divider vertical inset class="ml-3"></v-divider>
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
      <!-- <v-text-field
        v-model="search"
        append-icon="search"
        label="Поиск"
        hide-details>
      </v-text-field> -->
    </v-toolbar>
    <works-dialog slot="works-dialog"
      :wdialog="dialog"
      @saveAction="save_action"
      @cancelAction="dialog = false">
    </works-dialog>
    <works-table slot="works-table"
      :works="works">
    </works-table>
    <v-toolbar slot="footer" class="mt-2 elevation-2" dense flat>
      <v-toolbar-title class="caption">
        Тут будет подбадривающий текст
      </v-toolbar-title>
    </v-toolbar>
  </v-layout>
</template>

<script>
import crud from './index.js'
import WorkTable from './WDataTable'
import WorkDialog from './WEditDlg'

export default {
  components: {
    'works-dialog': WorkDialog,
    'works-table': WorkTable
  },
  data () {
    return {
      dialog: false,
      snack: {
        text: ''
      },
      // Данные
      works: [], // Все доступные знания
      code: 0 // Код 0 - состояние ожидания действий
    }
  },
  methods: {
    save_action (work) {
      crud.save(this, crud.format(work))
    }
  },
  mounted: function () {
    crud.get(this)
  }
}
</script>
