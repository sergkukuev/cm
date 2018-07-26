<template>
  <div>
    <v-toolbar slot="header" class="mb-2 elevation-2" flat>
      <v-toolbar-title>Список направлений</v-toolbar-title>
      <v-divider inset vertical class="mx-3"></v-divider>
      <v-btn color="primary" @click="dialog = true" fab small class="mx-1 elevation-1">
        <v-icon dark>add</v-icon>
      </v-btn>
    </v-toolbar>
    <works-dialog slot="works-dialog"
      :wdialog="dialog"
      @saveAction="save_action"
      @cancelAction="dialog = false">
    </works-dialog>
    <works-table slot="works-table"
      :works="works"
      @editItem="console.log('edit')"
      @removeItem="console.log('remove')">
    </works-table>
    <v-toolbar slot="footer" class="mt-2 elevation-2" dense flat>
      <v-toolbar-title class="caption">
        Тут будет подбадривающий текст
      </v-toolbar-title>
    </v-toolbar>
  </div>
</template>

<script>
import crud from './index.js'
import WorkTable from './Table'
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
