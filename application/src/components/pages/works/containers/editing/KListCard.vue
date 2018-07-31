<template>
  <!-- Список требуемых знаний для задачи в элемент card -->
  <v-card-text style="height: 300px">
    <v-layout row wrap :class="frame"
      justify-center v-if="knowledges.length == 0"
    >
      <span>{{ no_data }}</span>
    </v-layout>
    <v-layout row wrap
      v-else
      v-for="knowledge in knowledges"
      :key="knowledge.id"
      :class="frame"
    >
      <v-flex d-flex xs12 md9 mt-2>
        <span>{{ knowledge.name }}</span>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex d-flex xs8 md2>
        <v-tooltip top max-width="400px">
          <!-- Выбор оценочного уровня знания -->
          <v-select
            slot="activator"
            class="mt-1 mr-2 font-weight-light subheading"
            :items="marks"
            item-text="text"
            item-value="value"
            v-model="knowledge.mark"
            persistent-hint
            return-object
            single-line
          >
          </v-select>
          <span>Оценочные уровни:</span><br>
          <span v-for="(mark, i) in knowledge.marks" :key="i">{{i + 1}} -
            <strong>{{marks[i].text}}</strong>
            - {{mark}}<br></span>
        </v-tooltip>
      </v-flex>
      <v-flex d-flex xs4 md1 align-center text-xs-right>
        <v-tooltip bottom>
          <v-icon slot="activator"
            class="mx-2"
            @click="$emit('deleteMark', knowledges.indexOf(knowledge))"
          >
            delete
          </v-icon>
          <span>Удалить</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
  </v-card-text>
</template>

<script>
export default {
  props: ['knowledges'],
  data () {
    return {
      marks: [
        { text: 'начальный', value: 1 },
        { text: 'базовый', value: 2 },
        { text: 'продвинутый', value: 3 },
        { text: 'экспертный', value: 4 }
      ],
      frame: 'background subheading font-weight-light mb-2 py-2 pl-3',
      no_data: 'Требуемые знания отсутствуют'
    }
  }
}
</script>
