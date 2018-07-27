<template>
  <v-data-table
    :headers="headers"
    :items="works"
    class="elevation-2"
    no-results-text="По данному запросу результатов не найдено"
    no-data-text="Нет доступных данных">
    <!-- Слот с данными -->
    <template slot="items" slot-scope="props">
      <tr @click="props.expanded = !props.expanded">
        <td>{{ props.item.name }}</td>
        <td style="width: 5%">
          <v-icon small @click="$emit('editItem', props.item)" class="mr-2">edit</v-icon>
          <v-icon small @click="$emit('removeItem', props.item)">delete</v-icon>
        </td>
      </tr>
    </template>
    <template slot="expand" slot-scope="props">
      <tasks-container slot="tasks-container"
        :tasks="props.item.tasks">
      </tasks-container>
    </template>
    <template slot="pageText" slot-scope="props">
      {{ props.pageStart }}-{{props.pageStop }} из {{ props.itemsLength}}
    </template>
  </v-data-table>
</template>

<script>
import TContainer from './TasksTable'

export default {
  components: {
    'tasks-container': TContainer
  },
  props: ['works'],
  data () {
    return {
      headers: [
        { text: 'Наименование', align: 'left', value: 'name' },
        { text: 'Действия', sortable: false }
      ]
    }
  }
}
</script>

<style>
  .container {
    min-height: 100px;
    max-height: 50px;
  }
</style>
