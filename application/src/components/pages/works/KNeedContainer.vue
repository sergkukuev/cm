<template>
  <v-container class="elevation-1 mt-2">
    <span>Требуемые знания: </span>
    <v-tooltip bottom>
      <v-btn slot="activator" icon @click="show = !show">
        <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
      </v-btn>
      <span> {{ show ? 'Скрыть' : 'Показать' }}</span>
    </v-tooltip>
    <v-dialog v-model="dialog" max-width="800px">
      <v-btn slot="activator" color="primary" small dark class="mb-2">
        Выбрать знания
      </v-btn>
      <kns-sel-container
        :open="dialog"
        :exists="kns"
        @selectedAction="selected_action"
        @cancelAction="dialog = false">
      </kns-sel-container>
    </v-dialog>
    <v-layout justify-space-around column>
      <kns-need-list
        v-show="show"
        :knowledges="kns">
      </kns-need-list>
    </v-layout>
  </v-container>
</template>

<script>
import KSelector from './KSelector'
import KNeedList from './KNeedList'

export default {
  props: ['kns'],
  components: {
    'kns-sel-container': KSelector,
    'kns-need-list': KNeedList
  },
  data () {
    return {
      dialog: false,
      show: false
    }
  },
  methods: {
    // Проброс выбранных знаний для задачи
    selected_action (items) {
      this.dialog = false
      this.$emit('selectedAction', items)
    }
  }
}
</script>
