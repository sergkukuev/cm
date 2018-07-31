<template>
  <!-- Карточка редактирования задачи -->
  <v-card style="width: 100%" class="elevation-2">
    <v-card-title
      class="title font-weight-medium accent elevation-2"
      primary-title
    >
      Задача {{ index }}
      <v-spacer></v-spacer>
      <!-- Действия с задачей: удалить и закрыть окно -->
      <v-flex align-start text-xs-right>
        <v-tooltip bottom>
          <v-icon slot="activator"
            @click="$emit('deleteAction', index)"
          >
            delete
          </v-icon>
          <span>Удалить</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-icon slot="activator"
            @click="$emit('closeAction')"
            class="ml-2"
          >
            clear
          </v-icon>
          <span>Закрыть</span>
        </v-tooltip>
      </v-flex>
    </v-card-title>
    <v-divider></v-divider>
    <!-- Параметры задачи -->
    <v-card-text v-if="all != 0" class="font-weight-light">
      <v-layout row wrap>
        <v-flex d-flex xs12 md9>
          <v-text-field
            box
            class="mx-1"
            background-color="background"
            v-model="task.name"
            label="Наименование задачи"
          >
          </v-text-field>
        </v-flex>
        <v-flex d-flex xs12 md3>
          <v-select
            class="mx-1"
            v-model="task.rank"
            label="Квалификация"
            background-color="background"
            :items="ranks"
            item-text="text"
            item-value="value"
            persistent-hint
            return-object
            box
          >
          </v-select>
        </v-flex>
        <!-- Заголовок списка требуемых знаний -->
        <v-flex d-flex xs12 sm7 mt-4>
          <span class="title font-weight-regular">Требуемые знания:</span>
        </v-flex>
        <v-flex xs1 sm1 text-xs-right>
          <v-tooltip bottom>
            <v-icon
              class="mt-4 mb-0 mr-2"
              slot="activator"
              @click="task.need = []"
              v-if="task.need.length != 0"
            >
              clear
            </v-icon>
            <span>Очистить список</span>
          </v-tooltip>
        </v-flex>
        <!-- Диалоговое окно-селектор знаний -->
        <v-flex d-flex xs11 sm4>
          <v-dialog v-model="dialog" max-width="800px">
            <v-btn
              block
              slot="activator"
              class="accent text--primary font-weight-regular mt-3 mb-0"
            >
              Выбрать
            </v-btn>
            <kns-selector
              :open="dialog"
              :exists="task.need"
              @selectedAction="selected_action"
              @cancelAction="dialog = false"
            >
            </kns-selector>
          </v-dialog>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-text v-else class="font-weight-light" text-xs-center>
      <span>Задачи отсутствуют</span>
    </v-card-text>
    <v-divider v-if="all != 0"></v-divider>
    <!-- Список выбранных требуемых знаний -->
    <kns-need-list
      v-if="all != 0"
      :knowledges="task.need"
      @deleteMark="delete_mark"
    >
    </kns-need-list>
    <v-divider></v-divider>
    <!-- Кнопки переключения между задачами -->
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn slot="activator"
          :disabled="index <= 1"
          icon
          large
          @click="$emit('prevAction')"
        >
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
        <span>Предыдущая</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn slot="activator"
          :disabled="index >= all"
          icon
          large
          @click="$emit('nextAction')"
        >
          <v-icon>keyboard_arrow_right</v-icon>
        </v-btn>
        <span>Следующая</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>
import KSelector from './KSelector'
import KNeedList from './KListCard'

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
      dialog: false
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
