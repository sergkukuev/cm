<template>
  <div id="app">
    <v-container>
      <img src="./assets/images/logo.png">
      <router-view/>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  @import "./assets/styles";
  body {
    background: url('./assets/images/background.jpg') no-repeat center center fixed;
    &:after {
      content: '';
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: $background-tint; // фильтр
      opacity: .3;
      z-index: -1;
    }
  }
//#app {
//  font-family: 'Avenir', Helvetica, Arial, sans-serif;
//  -webkit-font-smoothing: antialiased;
//  -moz-osx-font-smoothing: grayscale;
//  text-align: center;
//  color: #2c3e50;
//  margin-top: 60px;
//}
</style>
