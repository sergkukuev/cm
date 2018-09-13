import {api} from './index'
import {Authenticate} from './authenticate'

// Авторизация пользователя
export function auth (context, data) {
  let path = '/auth'
  api.post(path, data).then((res) => {
    // Успешная авторизация
    if (res.status === 200) {
      context.$cookie.set('login', data.login)
      context.$cookie.set('access_token', res.data.content.access_token.token)
    // Что-то пошло не так
    } else {
      context.$cookie.delete('login')
      context.$cookie.delete('access_token')
      context.last.text = res.data.message
    }
    context.code = res.status
    Authenticate()
  }, (err) => {
    console.log(err.response.data)
    context.last.text = err.response.data.message
    context.code = err.response.status
  })
}

export default { auth }
