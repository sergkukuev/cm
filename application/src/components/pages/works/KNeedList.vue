<template>
  <v-data-table
    :items="knowledges"
    hide-headers
    hide-actions
    class="elevation-2">
    <!-- Слот с данными -->
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
  </v-data-table>
</template>

<script>
export default {
  props: ['knowledges'],
  data () {
    return {
      ranks: [1, 2, 3, 4],
      headers: [
        { text: 'Знание', align: 'left', value: 'name' },
        { text: 'Оценка', sortable: false }
      ]
    }
  }
}
</script>
