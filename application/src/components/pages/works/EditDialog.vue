<template>
    <div class="text-xs-center d-flex">
    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="headline primary white--text" primary-title>
          Добавление работы
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="name"
            label="Наименование">
          </v-text-field>
          <v-card-text v-for="(task, i) in tasks" :key="i" class="elevation-2 mb-2">
            <v-layout row wrap>
              <v-flex xs11>
                <span class="title">Задача №{{i}}</span>
              </v-flex>
              <v-flex xs1 class="text-xs-right">
                <v-icon small @click="delete_task(i)">delete</v-icon>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row wrap>
              <v-flex xs10 class="mr-4">
                <v-text-field
                  v-model="task.name"
                  label="Наименование">
                </v-text-field>
              </v-flex>
              <v-flex xs1 class="ml-4">
                <v-select
                  :items="ranks"
                  v-model="rank"
                  :hint="'Ранг'"
                  persistent-hint
                  return-object
                  single-line>
                  </v-select>
              </v-flex>
            </v-layout>
            <v-tooltip bottom>
              <v-btn block slot="activator" color="primary" dark @click="add_knowledges">
                <v-icon dark>add</v-icon>
              </v-btn>
              <span>Добавить знания к задаче №{{i}}</span>
            </v-tooltip>
          </v-card-text>
          <v-tooltip bottom>
            <v-btn block slot="activator" color="primary" dark @click="add_task">
              <v-icon dark>add</v-icon>
            </v-btn>
            <span>Добавить задачу</span>
          </v-tooltip>
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
export default {
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
