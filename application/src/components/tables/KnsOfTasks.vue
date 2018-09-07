<!-- Компонент: таблица всех знаний выбранной задачи. Содержит обращение к серверу -->
<template>
  <v-layout fill-height column>
    <v-data-table
      style="width: 100%"
      :items="kns"
      hide-headers
      hide-actions
      class="elevation-2"
      no-results-text="По данному запросу результатов не найдено"
      no-data-text="Нет доступных данных"
    >
      <!-- Слот с данными -->
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.name }}</td>
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
import {getById} from '@/api/knowledges'

export default {
  props: ['kns_id', 'errors'],
  data () {
    return {
      kns: [], // Массив знаний, идентификаторы которых лежат в kns_id
      index: 0, // Последовательный индекс считывания знаний
      knowledge: {}, // Переменная, куда происходит считывание
      // Параметры последнего ответа
      last: {
        text: 'Здесь лежит описание последней ошибки или операции',
        code: 0 // Код последней операции
      },
      code: 0 // Код 0 - состояние ожидания ввода
    }
  },
  watch: {
    code (value) {
      // 100 - 199 Информационные
      // 200 - 299 Успешные
      // 300- 399 Перенаправление
      // 400 - 499 Ошибка клиента
      // 500 - 599 Ошибка сервера
      if (value !== 0) {
        this.last.code = value
      }
      if (value >= 100 && value < 200) {
        console.log('Код: ' + value + ' Описание: ' + this.last.text)
      } else if (value >= 400 && value < 600) {
        console.log('Код: ' + value + ' Описание: ' + this.last.text)
        this.$emit('E-inc') // Инкремент ошибки
      }
      this.code = 0 // Сброс кода в ожидание
    },
    // Отслеживание переменной считывания
    knowledge (value) {
      value.mark = this.kns_id[this.index].mark
      this.kns.push(value)
      this.index++
    }
  },
  mounted: function () {
    this.$emit('E-reset') // Сброс количества ошибок
    this.kns = []
    this.index = 0 // Сброс индекса
    for (let i = 0; i < this.kns_id.length; i++) {
      getById(this, this.kns_id[i].id_knowledge)
    }
  }
}
</script>
