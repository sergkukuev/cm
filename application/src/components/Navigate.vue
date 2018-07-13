<template>
  <header class="l-navigate-panel">
    <v-layout row align-center justify-space-between>
      <v-jumbotron :gradient="gradient" dark height="60px">
        <v-container fill-height>
          <!-- <img class="l-image" src="./../assets/images/logo.png"> -->
          <!-- Активные ссылки -->
          <v-flex class="link-navigate">
            <router-link  to="/">
              Главная
            </router-link>
            &nbsp;
            <router-link to="/knowledges">
              Знания
            </router-link>
          </v-flex>
          <!-- Панель поиска -->
          <v-flex v-if="display_search" xs2 md4>
            <v-text-field
                  v-model="search"
                  append-icon="search"
                  color="light-blue accent-4 white--text"
                  label="Поиск"
                  clearable>
            </v-text-field>
          </v-flex>
          <!-- Кнопка авторизация -->
          <v-flex>
            <v-btn class="btn" color="light-blue accent-4 white--text" @click.native="sss()">Выйти</v-btn>
          </v-flex>
        </v-container>
      </v-jumbotron>
    </v-layout>
  </header>
</template>

<script>
export default {
  data () {
    return {
      search: '', // Данные поиска
      gradient: 'to right, #0099f1, #001572', // Градиент
      display_search: true // Статус отображения строки поиска
    }
  },
  mounted: function () {
    this.display_search = true
  }
}
</script>

<style lang="scss">
  @import "./../assets/styles.scss";
  .l-navigate-panel {
    @extend .base-window;
  }
  .btn {
    margin-top: 5px;
  }
  .link-navigate {
    a {
      text-decoration: none;
      display: inline-block;
      padding: 15px 0;
      font-size: 18px;
      transition: .3s ease-in-out;
      color: white;
      //color: #969696;
      text-shadow: 1px 1px black;
      letter-spacing: 1px;
      border-bottom: 2px solid transparent;
    }
    a:hover {
      //color: #F54318;
      //border-bottom: 2px solid #F54318;
      color: #29b6f6;
      border-bottom: 2px solid #29b6f6;
      box-shadow: 0 1px 0 white, 0 2px 0 #969696;
    }
  }
</style>
