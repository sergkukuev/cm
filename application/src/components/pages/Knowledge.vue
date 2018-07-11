<template lang="html">
  <div id="kns">
    <table class="table">
        <thead>
          <tr>
            <th>Знание</th>
            <th>Категория</th>
            <th>Подкатегория</th>
            <th>Ранжирование оценок</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in kns" :key="item.id">
            <td>{{item.name}}</td>
            <td>{{item.category}}</td>
            <td>{{item.sub_category}}</td>
            <td>{{item.marks}}</td>
          </tr>
        </tbody>
      </table>
  </div>
</template>

<script>
import {API} from './../../router/api.js'

export default {
  name: 'knowledges',
  data: function () {
    return {
      kns: [],
      stPage: 0,
      error: {}
    }
  },
  methods: {
    get_kns: function () {
      let path = '/kns'
      API.get(path).then((response) => {
        this.kns = response.data
        console.log(this.kns)
      }, (err) => {
        this.error = err
      })
    }
  },
  mounted: function () {
    this.get_kns()
  }
}
</script>

<style lang="css">
</style>
