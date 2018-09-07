<!-- Компонент: таблица всех задач выбранной работы -->
<template>
  <v-data-table
    style="width: 100%"
    :items="tasks"
    hide-headers
    hide-actions
    class="elevation-1"
    no-results-text="По данному запросу результатов не найдено"
    no-data-text="Нет доступных данных"
  >
    <!-- Слот с данными -->
    <template slot="items" slot-scope="props">
      <tr @click="select_item(props.item)"
        :class="selected == tasks.indexOf(props.item) ? 'accent' : ''"
      >
        <td>{{ tasks.indexOf(props.item) + 1 }}</td>
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
</template>

<script>
export default {
  props: ['tasks'],
  data () {
    return {
      // Конвертация ранга
      rank: [
        'ведущий',
        '1 кат.',
        '2 кат.',
        '3 кат.',
        'б/кат'
      ],
      selected: -1
    }
  },
  methods: {
    select_item (item) {
      if (this.selected === this.tasks.indexOf(item)) {
        this.selected = -1
      } else {
        this.selected = this.tasks.indexOf(item)
      }
      this.$emit('A-selected', this.selected)
    },
    get_rank (index) {
      return this.rank[index]
    }
  }
}
</script>
