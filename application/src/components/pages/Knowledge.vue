<template>
  <main class="l-knowledge-page">
    <app-navbar></app-navbar>
    <div class="l-knowledge">
      <kns-list>
        <list-header slot="list-header"></list-header>
        <list-body slot="list-body" :kns="kns"></list-body>
      </kns-list>
    </div>
  </main>
</template>

<script>
import {API} from './../../router/api.js'
import ListHeader from './../Knowledge/ListHeader'
import ListBody from './../Knowledge/ListBody'

export default {
  name: 'knowledges',
  components: {
    'list-header': ListHeader,
    'list-body': ListBody
  },
  data: function () {
    return {
      kns: [],
      status: 0,
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

<style lang="scss" scoped>
  @import "./../../assets/styles";

  .l-knowledge {
    @extend .frame;
    min-width: 272px;
  }
</style>
