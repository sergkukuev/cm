<template>
  <v-layout fill-height column>
    <v-data-table
      style="width: 100%"
      :items="knowledges"
      hide-headers
      hide-actions
      class="elevation-2"
      no-results-text="По данному запросу результатов не найдено"
      no-data-text="Нет доступных данных"
    >
      <!-- Слот с данными -->
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ findNameById(props.item.id_knowledge) }}</td>
          <td>{{ props.item.mark }}</td>
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
import {api} from './../../../../../api'

export default {
  props: ['knowledges'],
  data () {
    return {
      my_kns: []
    }
  },
  methods: {
    get_kns () {
      let path = '/kns/'
      api.get(path).then((res) => {
        this.my_kns = res.data
      }, (err) => {
        console.log(err.response.data)
      })
    },
    findNameById (id) {
      for (let i = 0; i < this.my_kns.length; i++) {
        if (id === this.my_kns[i].id) {
          return this.my_kns[i].name
        }
      }
      return id
    }
  },
  mounted: function () {
    this.get_kns()
  }
}
</script>
