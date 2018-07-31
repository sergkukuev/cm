<template>
  <div class="text-xs-center d-flex">
    <!-- Диалоговое окно направления -->
    <v-dialog v-model="dialog" max-width="1000px" scrollable persistent>
      <!-- Диалоговое окно задачи -->
      <v-dialog v-model="tdialog" max-width="1000px" scrollable>
        <task-edit-card
          :index="index"
          :all="work.tasks.length"
          :task="work.tasks[index - 1]"
          @deleteAction="delete_task"
          @prevAction="index--"
          @nextAction="index++"
          @closeAction="tdialog = false"
        >
        </task-edit-card>
      </v-dialog>
      <v-card>
        <v-card-title
          class="title accent elevation-2 font-weight-regular"
          primary-title
        >
          Добавление направления
        </v-card-title>
        <!-- Параметры направления-->
        <v-card-text class="font-weight-light">
          <v-layout row wrap>
            <v-flex d-flex xs12>
              <v-text-field
                v-model="work.name"
                label="Наименование направления"
                background-color="background"
                box
              >
              </v-text-field>
            </v-flex>
            <!-- Заголовок списка задач в направлении -->
            <v-flex d-flex xs10>
              <span class="title font-weight-regular pl-2">
                Задачи:
              </span>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex d-flex xs1 text-xs-right>
              <v-tooltip bottom>
                <v-icon slot="activator" @click="add_task">add</v-icon>
                <span>Добавить задачу</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <!-- Список задач -->
        <task-list-card
          :tasks="work.tasks"
          @editAction="edit_task"
          @deleteAction="delete_task"
        >
        </task-list-card>
        <v-divider></v-divider>
        <!-- Действия окна: отмена и сохранить -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="transparent text--primary font-weight-regular elevation-0"
            @click="$emit('cancelAction')"
          >
            Отмена
          </v-btn>
          <v-btn
            class="accent text--primary font-weight-regular"
            @click="save_work"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TEdit from './TEditCard'
import TList from './containers/TListCard'

export default {
  components: {
    'task-list-card': TList,
    'task-edit-card': TEdit
  },
  props: ['wdialog'],
  data () {
    return {
      tdialog: false,
      dialog: false,
      redact: true,
      index: 0,
      work: {
        name: '',
        tasks: []
      }
    }
  },
  watch: {
    wdialog (value) {
      this.dialog = value
    },
    index (value) {
      // В случае, если индекс вываливает за дозволенные границы
      if (value < 0 || value > this.work.tasks.length) {
        value < 0 ? this.index = 0 : this.index = this.work.tasks.length
      }
    }
  },
  methods: {
    save_work () {
      this.$emit('saveAction', this.work)
    },
    add_task () {
      this.index++
      this.work.tasks.push(this.deafult_task())
      this.tdialog = true
    },
    edit_task (index) {
      this.index = index
      this.tdialog = true
    },
    clear_tasks () {
      this.work.taks = []
    },
    delete_task (index) {
      this.tdialog = false
      index === undefined ? this.index-- : this.index = index - 1
      this.work.tasks.splice(this.index, 1)
    },
    deafult_task () {
      return {
        name: 'Безымянная задача',
        rank: {
          value: 3
        },
        need: []
      }
    }
  }
}
</script>
