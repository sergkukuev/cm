<template>
  <v-data-table
    :headers="headers"
    :items="knowledges"
    :search="search"
    class="elevation-2"
    no-results-text="По данному запросу результатов не найдено"
    no-data-text="Нет доступных данных">
    <!-- Слот с данными -->
    <template slot="items" slot-scope="props">
      <tr @click="props.expanded = !props.expanded">
        <td style="width: 50%">{{ props.item.name }}</td>
        <td>{{ props.item.ctgr }}</td>
        <td>{{ props.item.sctgr }}</td>
        <td style="width: 5%">
          <v-icon small @click="$emit('editItem', props.item)" class="mr-2">edit</v-icon>
          <v-icon small @click="$emit('removeItem', props.item)">delete</v-icon>
        </td>
      </tr>
    </template>
    <template slot="expand" slot-scope="props">
      <v-container fluid>
        <span>
          Оценочные уровни знания:
        </span>
        <v-card class="mt-2">
          <v-card-text class="primary lighten-5">1 - {{ props.item.marks[0] }}</v-card-text>
          <v-card-text class="primary lighten-4">2 - {{ props.item.marks[1] }}</v-card-text>
          <v-card-text class="primary lighten-3">3 - {{ props.item.marks[2] }}</v-card-text>
          <v-card-text class="primary lighten-2">4 - {{ props.item.marks[3] }}</v-card-text>
        </v-card>
      </v-container>
    </template>
    <template slot="pageText" slot-scope="props">
      {{ props.pageStart }}-{{props.pageStop }} из {{ props.itemsLength}}
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ['knowledges', 'search'],
  data () {
    return {
      headers: [
        { text: 'Наименование', align: 'left', value: 'name' },
        { text: 'Категория', value: 'ctgr' },
        { text: 'Подкатегория', value: 'sctgr' },
        { text: 'Действия', sortable: false }
      ]
    }
  }
}
</script>
