<template>
  <auth-dialog
    :wdialog="dialog"
    :info="last"
    :loading="loading"
    @A-authorize="authorize"
  >
  </auth-dialog>
</template>

<script>
import Auth from '@/components/dialogs/Auth'
import {user} from '@/api/authenticate'
import crud from '@/api/auth'

export default {
  components: {
    'auth-dialog': Auth
  },
  data () {
    return {
      dialog: true,
      // Параметры последнего ответа
      last: {
        text: 'Здесь лежит описание последней ошибки или операции',
        code: 0 // Код последней операции
      },
      loading: false, // Ожидание ответа
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
        this.loading = false // Пришел ответ от сервера
        this.last.code = value
      }
      if (value >= 200 && value < 300) {
        window.location.reload() // Придумать ход изящнеее
      } else if (value >= 400 && value < 600) {
        // TODO: Можно что-то сделать
      }
      this.code = 0 // Сброс кода в ожидание
    }
  },
  methods: {
    authorize (login, password) {
      let data = {
        login: login,
        password: password
      }
      this.loading = true
      crud.auth(this, data)
    },
    redirect () {
      if (user.authenticated) {
        window.location = 'http://localhost:8080/#/matrix'
      }
    }
  },
  mounted: function () {
    this.redirect()
  }
}
</script>
