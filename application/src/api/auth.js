import {api} from './index'

// Авторизация пользователя
export function auth (context, data) {
  let path = '/auth'
  api.post(path, data).then((res) => {
    // Успешная авторизация
    if (res.status === 200) {
      context.login = data.login
      context.access_token = res.data.content.access_token.token
    // Что-то пошло не так
    } else {
      context.login = 'undefined'
      context.access_token = ''
      context.last.text = res.data.description.message
    }
    context.code = res.status
  }, (err) => {
    console.log(err.response.data)
    context.last.text = err.response.data.description.message
    context.code = err.response.status
  })
}

export default { auth }
