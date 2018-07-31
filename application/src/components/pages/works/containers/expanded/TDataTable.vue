<template>
  <v-layout fill-height column>
    <v-data-table
      style="width: 100%"
      :items="tasks"
      hide-headers
      hide-actions
      class="elevation-2"
      no-results-text="По данному запросу результатов не найдено"
      no-data-text="Нет доступных данных"
    >
      <!-- Слот с данными -->
      <template slot="items" slot-scope="props">
        <tr @click="select_item(props.item)">
          <td>{{ props.item.name }}</td>
          <td>{{ get_rank(props.item.rank) }}</td>
        </tr>
      </template>
      <!-- Слот отсутствия данных -->
      <template slot="no-data">
        <div class="text-xs-center">
          <span>Нет доступных данных</span>
        </div>
      </template>
    </v-data-table>
  </v-layout>
</template>

<script>
export default {
  props: ['tasks'],
  data () {
    return {
      headers: [
        { text: 'Наименование', value: 'name', sortable: true },
        { text: 'Квалификация', value: 'rank', sortable: true }
      ],
      rank: [
        'ведущий',
        '1 кат.',
        '2 кат.',
        '3 кат.',
        'б/кат'
      ],
      // TODO: Сделать подсветку
      highlight: '', // Подсветка выбранного элемента,
      selected: -1
    }
  },
  methods: {
    select_item (item) {
      this.selected = this.tasks.indexOf(item)
      this.$emit('selectAction', this.selected)
    },
    get_rank (index) {
      return this.rank[index]
    }
  }
}
</script>
