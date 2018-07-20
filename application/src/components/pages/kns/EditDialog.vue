<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="headline primary white--text" primary-title>
          {{ title_dialog }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="item.name"
            label="Наименование">
          </v-text-field>
          <v-flex xs4>
            <v-switch v-model="activator" label="Категория"></v-switch>
          </v-flex>
          <v-layout row justify-space-between>
            <v-flex xs6>
              <v-text-field
                v-if="activator"
                v-model="item.ctgr"
                label="Категория">
              </v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                v-if="activator"
                v-model="item.sctgr"
                label="Подкатегория">
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row justify-space-between>
            <v-flex xs6>
              <v-textarea
                v-model="item.beginer"
                outline
                name="tx-area-1"
                label="1 - Начальный уровень">
              </v-textarea>
            </v-flex>
            <v-flex xs6>
              <v-textarea
                v-model="item.base"
                outline
                name="tx-area-2"
                label="2 - Базовый уровень">
              </v-textarea>
            </v-flex>
          </v-layout>
          <v-layout row justify-space-between>
            <v-flex xs6>
              <v-textarea
                v-model="item.advance"
                outline
                name="tx-area-3"
                label="3 - Продвинутый уровень">
              </v-textarea>
            </v-flex>
            <v-flex xs6>
              <v-textarea
                v-model="item.expert"
                outline
                name="tx-area-4"
                label="4 - Экспертный уровень">
              </v-textarea>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat round @click="cancel_action">Отмена</v-btn>
          <v-btn color="primary" round @click="save_action">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['default', 'wdialog'],
  data () {
    return {
      dialog: false,
      activator: false, // Активатор категории
      item: {
        name: '',
        ctgr: '',
        sctgr: '',
        // Уровни
        beginer: '',
        base: '',
        advance: '',
        expert: ''
      }
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
      this.copy(this.default, this.item)
      this.default.ctgr !== '' || this.default.sctgr !== '' ? this.activator = true : this.activator = false
    }
  },
  methods: {
    save_action () {
      let data = this.diff_compare(this.format(), this.default)
      if (JSON.stringify(data) !== '{}') {
        this.$emit('saveAction', this.default.id, data)
      } else {
        console.log('Ничего не изменилось, нет смысла сохранять')
      }
    },
    cancel_action () {
      let data = this.format()
      if (!this.is_equal(data, this.default)) {
        const msg = [
          'Вы уверены, что хотите выйти из режима редактирования?',
          'Все несохраненные данные будут потеряны.'
        ]
        confirm(msg[0] + '\n' + msg[1]) && this.$emit('cancelAction')
      } else {
        this.$emit('cancelAction')
      }
    },
    copy (from, to) {
      to.name = from.name
      to.ctgr = from.ctgr
      to.sctgr = from.sctgr
      to.beginer = from.marks[0]
      to.base = from.marks[1]
      to.advance = from.marks[2]
      to.expert = from.marks[3]
    },
    format () {
      let data = {
        name: this.item.name,
        ctgr: this.item.ctgr,
        sctgr: this.item.sctgr,
        marks: [
          this.item.beginer,
          this.item.base,
          this.item.advance,
          this.item.expert
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
