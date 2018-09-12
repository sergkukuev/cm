<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card class="elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Авторизация</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            prepend-icon="person"
            v-model="login"
            label="Имя пользователя"
            type="text"
            box
          >
          </v-text-field>
          <v-text-field id="password"
            prepend-icon="lock"
            :append-icon="password.show ? 'visibility_off' : 'visibility'"
            v-model="password.value"
            label="Пароль"
            counter
            box
            :type="password.show ? 'text' : 'password'"
            @click:append="password.show = !password.show"
          >
          </v-text-field>
        </v-form>
        <v-alert :value="info.code >= 400" type="error">
          {{ info.text }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary"
          @click="$emit('A-authorize', login, password.value)"
          :loading="loading"
          :disabled="loading"
          block
        >
          Войти
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['wdialog', 'info', 'loading'],
  data () {
    return {
      dialog: true,
      login: 'admin',
      password: {
        value: 'admin',
        show: false
      }
    }
  },
  watch: {
    wdialog (value) {
      this.dialog = value
    }
  }
}
</script>
