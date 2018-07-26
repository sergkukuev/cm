<template>
  <v-layout row wrap>
    <v-card style="width: 100%" class="elevation-3">
      <v-card-title class="subheading">
        Задача {{ index }}
        <v-spacer></v-spacer>
        <!-- <v-icon small class="mr-2">save</v-icon> -->
        <v-tooltip bottom>
          <v-icon slot="activator" small v-if="all > 1" @click="$emit('deleteAction')">delete</v-icon>
          <span>Удалить задачу</span>
        </v-tooltip>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs7 class="mr-2">
            <v-text-field
              class="mt-1"
              v-model="task.name"
              label="Наименование задачи">
            </v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs2>
            <v-input class="subheading font-weight-light mt-2">Квалификация:</v-input>
          </v-flex>
          <v-flex xs2>
            <v-select
              class="mt-1"
              v-model="task.rank"
              label="Ранг"
              :items="ranks"
              item-text="text"
              item-value="value"
              persistent-hint
              return-object
              single-line>
            </v-select>
          </v-flex>
          <v-flex>
            <span class="subheading font-weight-regular">Требуемые знания:</span>
            <v-tooltip bottom>
              <v-btn slot="activator" @click="show_list = !show_list" icon small>
                <v-icon>{{show_list ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}}</v-icon>
              </v-btn>
              <span>{{show_list ? 'Скрыть' : 'Показать'}}</span>
            </v-tooltip>
          </v-flex>
          <v-tooltip bottom>
            <v-icon
              slot="activator"
              class="mt-2"
              @click="task.need = []"
              v-if="task.need.length != 0">clear</v-icon>
            <span>Очистить список</span>
          </v-tooltip>
          <v-dialog v-model="dialog" max-width="800px">
            <v-btn
              slot="activator"
              class="accent text--primary font-weight-regular"
              small>
              Выбрать
            </v-btn>
            <kns-selector
              :open="dialog"
              :exists="task.need"
              @selectedAction="selected_action"
              @cancelAction="dialog = false">
            </kns-selector>
          </v-dialog>
          <v-flex xs12>
            <kns-need-list
              v-show="show_list"
              :knowledges="task.need"
              @deleteMark="delete_mark">
            </kns-need-list>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import KSelector from './KSelector'
import KNeedList from './KNeedList'

export default {
  props: ['index', 'all', 'task'],
  components: {
    'kns-selector': KSelector,
    'kns-need-list': KNeedList
  },
  data () {
    return {
      ranks: [
        { text: 'ведущий', value: 0 },
        { text: '1 кат.', value: 1 },
        { text: '2 кат.', value: 2 },
        { text: '3 кат.', value: 3 },
        { text: 'б/кат', value: 4 }
      ],
      dialog: false,
      show_list: false
    }
  },
  methods: {
    // Данные из селектора
    selected_action (knowledges) {
      this.dialog = false
      this.task.need = knowledges
    },
    delete_mark (i) {
      this.task.need.splice(i, 1)
    }
  }
}
</script>
