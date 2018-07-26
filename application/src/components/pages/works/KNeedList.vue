<template>
  <div class="mx-2 elevation-1">
    <v-layout row v-if="knowledges.length <= 0">
      <v-spacer></v-spacer>
      <v-flex xs4>
        <v-input class="body-1">{{ no_data }}</v-input>
      </v-flex>
      <v-spacer></v-spacer>
    </v-layout>
    <v-divider></v-divider>
    <div
      class="body-1"
      v-for="knowledge in knowledges"
      :key="knowledge.id">
      <v-layout row>
        <v-flex xs10>
          <v-input class="body-1 font-weight-light ml-4">{{ knowledge.name }}</v-input>
        </v-flex>
        <v-flex xs1>
          <v-tooltip top max-width="400px">
            <v-select
              slot="activator"
              class="mt-1 mr-2"
              :items="ranks"
              v-model="knowledge.mark"
              persistent-hint
              return-object
              single-line>
            </v-select>
            <span>Оценочные уровни:</span><br>
            <span v-for="(mark, i) in knowledge.marks" :key="i">{{i + 1}} - {{mark}}<br></span>
          </v-tooltip>
        </v-flex>
        <v-flex xs1>
          <v-tooltip bottom>
            <v-icon
              small
              slot="activator"
              @click="$emit('deleteMark', knowledges.indexOf(knowledge))"
              class="mt-3 mr-4">
              delete
            </v-icon>
            <span>Удалить оценку</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </div>
  </div>
  <!-- <v-data-table
    :items="knowledges"
    hide-headers
    hide-actions
    class="elevation-2">
    <template slot="items" slot-scope="props">
      <td style="width: 85%">{{ props.item.name }}</td>
      <v-tooltip right max-width="400px">
        <td slot="activator" class="py-1">
          <v-select
            :items="ranks"
            v-model="props.item.mark"
            :hint="'Оценка'"
            persistent-hint
            return-object
            single-line>
          </v-select>
        </td>
        <span>Оценочные уровни знания: <br></span>
        <span v-for="(mark, i) in props.item.marks" :key="i">{{i + 1}} - {{mark}}<br></span>
      </v-tooltip>
    </template>
    <template slot="no-data">
      <div class="text-xs-center">
        Требуемые знания отсутствуют
      </div>
    </template>
    <template slot="pageText" slot-scope="props">
      {{ props.pageStart }}-{{props.pageStop }} из {{ props.itemsLength}}
    </template>
  </v-data-table> -->
</template>

<script>
export default {
  props: ['knowledges'],
  data () {
    return {
      ranks: [1, 2, 3, 4],
      no_data: 'Требуемые знания отсутствуют',
      headers: [
        { text: 'Знание', align: 'left', value: 'name' },
        { text: 'Оценка', sortable: false }
      ]
    }
  }
}
</script>
