<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs6>
        <v-data-table
          :headers="headers"
          :items="tasks"
          class="elevation-2"
          no-data-text="Нет доступных данных">
          <!-- Слот с данными -->
          <template slot="items" slot-scope="props">
            <tr @click="selected = tasks.indexOf(props.item)">
              <td style="width: 5%">{{ props.item.rank }}</td>
              <td>{{ props.item.name }}</td>
            </tr>
          </template>
          <template slot="pageText" slot-scope="props">
            {{ props.pageStart }}-{{props.pageStop }} из {{ props.itemsLength}}
          </template>
        </v-data-table>
      </v-flex>
      <v-flex xs5 class="ml-2">
        <v-card v-if="selected === -1">
          <v-card-text>Ничего не выбрано</v-card-text>
        </v-card>
        <v-card v-else>
          <v-card-text v-for="(knowledge, i) in tasks[selected].need" :key="i">
            {{knowledge}}
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ['tasks'],
  data () {
    return {
      headers: [
        { text: 'Ранг', value: 'rank' },
        { text: 'Наименование', value: 'name' }
      ],
      selected: -1
    }
  }
}
</script>
