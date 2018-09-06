<template>
  <v-dialog v-model="dialog" max-width="1000px" persistent>
    <v-card>
      <v-card-title
        class="title accent elevation-2 font-weight-regular"
        primary-title
      >
        {{ title_dialog }}
      </v-card-title>
      <v-card-text class="font-weight-light">
        <v-layout row wrap>
          <!-- Поле наименования -->
          <v-flex d-flex xs12 class="px-1">
              <v-text-field
                background-color="background"
                v-model="name.value"
                :label="name.text"
                box
              >
              </v-text-field>
          </v-flex>
          <!-- Остальные поля данных -->
          <v-flex d-flex xs12 sm6 class="px-1" v-for="(item, i) in items" :key="i">
            <v-textarea v-if="item.area"
              box
              background-color="background"
              v-model="item.value"
              :label="item.text"
            >
            </v-textarea>
            <v-text-field v-else
              v-model="item.value"
              :label="item.text"
              background-color="background"
              box
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="transparent text--primary font-weight-regular elevation-0"
          @click="cancel_action"
        >
          Отмена
        </v-btn>
        <v-btn class="accent text--primary font-weight-regular"
          @click="save_action"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['default', 'wdialog'],
  data () {
    return {
      dialog: false,
      name: { text: 'Наименование', value: '' },
      items: [
        // Категория
        { text: 'Категория', value: '' },
        { text: 'Подкатегория', value: '' },
        // Оценочные уровни
        { text: '1 - Начальный уровень', value: '', area: true },
        { text: '2 - Базовый уровень', value: '', area: true },
        { text: '3 - Продвинутый уровень', value: '', area: true },
        { text: '4 - Экспертный уровень', value: '', area: true }
      ]
    }
  },
  computed: {
    title_dialog () {
      return this.default.id === undefined ? 'Добавление знания' : 'Редактирование знания'
    }
  },
  watch: {
    wdialog (value) {
      this.dialog = value
    },
    default (value) {
      this.copy(value)
      // this.default.ctgr !== '' || this.default.sctgr !== '' ? this.activator = true : this.activator = false
    }
  },
  methods: {
    save_action () {
      let data = this.diff_compare(this.format(), this.default)
      if (JSON.stringify(data) !== '{}') {
        this.$emit('A-save', this.default.id, data)
      } else {
        this.$emit('A-nochange')
      }
    },
    cancel_action () {
      let data = this.format()
      if (!this.is_equal(data, this.default)) {
        const msg = [
          'Вы уверены, что хотите выйти из режима редактирования?',
          'Все несохраненные данные будут потеряны.'
        ]
        confirm(msg[0] + '\n' + msg[1]) && this.$emit('A-cancel')
      } else {
        this.$emit('A-cancel')
      }
    },
    copy (from) {
      this.name.value = from.name
      this.items[0].value = from.ctgr
      this.items[1].value = from.sctgr
      this.items[2].value = from.marks[0]
      this.items[3].value = from.marks[1]
      this.items[4].value = from.marks[2]
      this.items[5].value = from.marks[3]
    },
    format () {
      let data = {
        name: this.name.value,
        ctgr: this.items[0].value,
        sctgr: this.items[1].value,
        marks: [
          this.items[2].value,
          this.items[3].value,
          this.items[4].value,
          this.items[5].value
        ]
      }
      return data
    },
    // Проверка идет по ключам первого элемента
    is_equal (one, two) {
      let result = true
      for (let key in one) {
        if (one[key] instanceof Array && two[key] instanceof Array) {
          if (one[key].length !== two[key].length) {
            result = false
          }
          for (let i = 0; i < one[key].length; i++) {
            if (one[key][i] !== two[key][i]) {
              result = false
            }
          }
        } else if (one[key] !== two[key]) {
          result = false
        }
      }
      return result
    },
    // Отличия между первым и вторым (возвращаются отличительные данные первого элемента от второго)
    diff_compare (one, two) {
      let data = {}
      for (let key in one) {
        if (one[key] instanceof Array && two[key] instanceof Array) {
          let bArr = false
          if (one[key].length !== two[key].length) {
            bArr = true
          }
          for (let i = 0; i < one[key].length; i++) {
            if (one[key][i] !== two[key][i]) {
              bArr = true
            }
          }
          if (bArr) {
            data[key] = one[key]
          }
        } else if (one[key] !== two[key]) {
          data[key] = one[key]
        }
      }
      return data
    }
  }
}
</script>
