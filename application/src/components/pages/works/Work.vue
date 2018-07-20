<template>
  <div>
    <v-toolbar slot="header" class="mb-2 elevation-2" flat>
      <v-toolbar-title>Список типовых работ</v-toolbar-title>
      <v-divider inset vertical class="mx-3"></v-divider>
      <v-btn color="primary" @click="dialog = true" fab small class="mx-1 elevation-1">
        <v-icon dark>add</v-icon>
      </v-btn>
    </v-toolbar>
    <works-dialog slot="works-dialog"
      :wdialog="dialog"
      @cancelAction="dialog = false">
    </works-dialog>
    <v-toolbar slot="footer" class="mt-2 elevation-2" dense flat>
      <v-toolbar-title class="caption">
        Тут будет подбадривающий текст
      </v-toolbar-title>
    </v-toolbar>
  </div>
</template>

<script>
import crud from './index.js'
import WorkDialog from './EditDialog'

export default {
  components: {
    'works-dialog': WorkDialog
  },
  data () {
    return {
      dialog: false,
      // Данные
      works: [], // Все доступные знания
      work: {}, // Дефолтное знание
      code: 0 // Код 0 - состояние ожидания действий
    }
  },
  mounted: function () {
    crud.get(this)
  }
}
</script>
