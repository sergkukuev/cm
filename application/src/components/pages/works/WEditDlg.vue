<template>
    <div class="text-xs-center d-flex">
    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="headline primary white--text" primary-title>
          Добавление направления
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="name"
            label="Наименование">
          </v-text-field>
          <task-edit></task-edit>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat round @click="$emit('cancelAction')">Отмена</v-btn>
          <v-btn color="primary" round @click="$emit('cancelAction')">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TEdit from './TEditContainer'

export default {
  components: {
    'task-edit': TEdit
  },
  props: ['wdialog'],
  data () {
    return {
      dialog: false,
      rank: '3',
      ranks: ['0', '1', '2', '3'],
      name: '',
      tasks: []
    }
  },
  watch: {
    wdialog (value) {
      this.dialog = value
    }
  },
  methods: {
    add_task () {
      let task = {
        id: 'akwjdnawjkdawd',
        name: 'Задачка умная, соленая, спелая и сочная',
        rank: 0,
        need: [{
          id_knowledge: 'awdawdawdadawd',
          mark: 3
        }]
      }
      this.tasks.push(task)
    },
    delete_task (index) {
      this.tasks.splice(index, 1)
    }
  },
  mounted: function () {
    let task = {
      id: 'akwjdnawjkdawd',
      name: 'Задачка умная',
      rank: 0,
      need: [{
        id_knowledge: 'awdawdawdadawd',
        mark: 3
      }]
    }
    this.tasks.push(task)
  }
}
</script>
