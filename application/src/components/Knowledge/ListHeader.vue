<template>
  <header class="l-kns-header">
    <div class="elem-list-header">Наименование знания</div>
    <div class="elem-list-header">Категория</div>
    <div class="elem-list-header">Оценки</div>
    <div class="elem-list-header">Действия</div>
  </header>
</template>

<style lang="scss">
  @import "./../../assets/styles";

  .l-kns-header {
    display: none;
    width: 100%;

    @media (min-width: 601px) {
      margin: 25px 0 0;
      display: flex;
    }
  }
</style>
