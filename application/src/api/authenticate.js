// Проверка авторизации пользователя
export var user = { authenticated: false }
export function Authenticate () {
  let login = null
  let access = null
  // Парсинг параметров из куки
  let cookie = document.cookie.split(' ')
  for (let i = 0; i < cookie.length; i++) {
    if (i < cookie.length - 1) {
      cookie[i] = cookie[i].slice(0, -1) // Удаляем ';', если не последний токен
    }
    let index = cookie[i].indexOf('=')
    // Параметры токена
    let name = cookie[i].slice(0, index)
    let value = cookie[i].slice(index + 1)
    if (name === 'login') {
      login = value
    } else if (name === 'access_token') {
      access = value
    }
  }
  login && access ? user.authenticated = true : user.authenticated = false
}
