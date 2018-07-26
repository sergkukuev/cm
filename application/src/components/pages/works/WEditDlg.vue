<template>
  <div class="text-xs-center d-flex">
    <v-dialog v-model="dialog" max-width="1000px" persistent>
      <v-card>
        <v-card-title class="title accent elevation-2 font-weight-regular" primary-title>
          Добавление направления
        </v-card-title>
        <v-card-text class="font-weight-light">
          <v-text-field
            class="mt-1"
            v-model="work.name"
            label="Наименование направления">
          </v-text-field>
          <v-layout row>
            <v-input class="subheading mt-1">Карточки задач:</v-input>
            <v-tooltip bottom>
              <v-btn slot="activator" class="mt-1" icon small @click="add_task">
                <v-icon>add</v-icon>
              </v-btn>
              <span>Добавить задачу</span>
            </v-tooltip>
          </v-layout>
          <task-edit-card
            :index="index"
            :all="work.tasks.length"
            :task="work.tasks[index - 1]"
            @deleteAction="delete_task">
          </task-edit-card>
          <v-layout row>
            <v-spacer></v-spacer>
            <v-pagination
              class="mt-1"
              v-model="index"
              color="primary"
              :length="work.tasks.length"
              :total-visible="7"
              circle>
            </v-pagination>
            <v-spacer></v-spacer>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="transparent text--primary font-weight-regular elevation-0" @click="$emit('cancelAction')">Отмена</v-btn>
          <v-btn class="accent text--primary font-weight-regular" @click="save_work">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TEdit from './TEditCard'

export default {
  components: {
    'task-edit-card': TEdit
  },
  props: ['wdialog'],
  data () {
    return {
      dialog: false,
      index: 1,
      work: {
        name: '',
        tasks: [{
          name: '',
          rank: 3,
          need: []
        }]
      }
    }
  },
  watch: {
    wdialog (value) {
      this.dialog = value
    },
    index (value) {
      // В случае, если индекс вываливает за дозволенные границы
      if (value < 1 || value > this.work.tasks.length) {
        value < 1 ? this.index = 1 : this.index = this.work.tasks.length
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
    },
    delete_task () {
      this.work.tasks.splice(this.index - 1, 1)
      if (this.index > this.work.tasks.length) {
        this.index--
      }
    },
    deafult_task () {
      return {
        name: '',
        rank: {
          value: 3
        },
        need: []
      }
    }
  }
}
</script>
