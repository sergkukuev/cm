<template>
  <section class="l-kns-body">
    <div class="md-kns" v-if="kns != null" v-for="item in kns" :key="item.id">
      <div class="elem-list-body">{{ item.name }}</div>
      <div class="elem-list-body">
        Кат: {{ item.category }}; <br>
        Подкат: {{ item.sub_category }};
      </div>
      <div class="elem-list-body">
        0 - {{item.marks[0]}}; <br><br>
        1 - {{item.marks[1]}}; <br><br>
        2 - {{item.marks[2]}}; <br><br>
        3 - {{item.marks[3]}}
      </div>
      <div class="kns-actions">
        <v-btn small flat color="blue-grey darken-3">
          <v-icon>mode_edit</v-icon>
        </v-btn>
        <v-btn small flat color="red darken-4">
          <v-icon>delete_forever</v-icon>
        </v-btn>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['kns']
}
</script>

<style lang="scss">
  @import "./../../assets/styles";

  .l-kns-body {
    display: flex;
    flex-direction: column;

    .md-kns {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin: 15px 0;

      @media (min-width: 960px) {
        flex-direction: row;
        margin: 0;
      }

      .kns-actions {
        @extend .elem-list-body;
        flex-basis: 25%;
        display: flex;
        .btn {
          min-width: 45px !important;
          margin: 0 5px !important;
        }
      }
    }
  }
</style>
