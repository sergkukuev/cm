<template>
  <v-container
    fluid
    id="scroll-target"
    style="max-height: 300px"
    class="background font-weight-light scroll-y"
  >
    <v-layout row>
      <v-flex xs6>
        <span>Задачи направления:</span>
      </v-flex>
      <v-flex xs6>
        <span>Требуемые знания:</span>
      </v-flex>
    </v-layout>
    <v-layout row align-start justify-space-between>
      <v-flex d-flex xs5 ma-1>
        <tdt :tasks="tasks" @selectAction="selected_item"></tdt>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex d-flex xs6 v-if="selected != -1" ma-1>
        <ktd :knowledges="tasks[selected].need"></ktd>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TDT from './expanded/TDataTable'
import KTD from './expanded/KDataTable'

export default {
  props: ['tasks'],
  components: {
    'tdt': TDT,
    'ktd': KTD
  },
  data () {
    return {
      headers: [
        { text: 'Ранг', value: 'rank' },
        { text: 'Наименование', value: 'name' }
      ],
      selected: -1
    }
  },
  methods: {
    selected_item (sel) {
      this.selected = sel
    }
  }
}
</script>
