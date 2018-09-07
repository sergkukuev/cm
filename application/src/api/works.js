import {api} from './index'

const success = 'Операция прошла успешно'

/* В context уходит:  works - список всех направлений
                      last.text - описание выполнения операции
                      code - код выполнения
*/

// Сохранение направления
export function save (context, data) {
  let path = '/works/create'
  api.post(path, data).then((res) => {
    context.works.push(res.data.content) // Вставка в массив, чтобы не делать дополнительный запрос на получение изменений
    context.last.text = success
    context.code = res.status
  }, (err) => {
    console.log(err.response.data)
    context.last.text = err.response.data.description.message
    context.code = err.response.status
  })
}

// Получение списка всех направлений
export function get (context) {
  let path = '/works'
  api.get(path).then((res) => {
    context.works = res.data.content
    context.last.text = success
    context.code = res.status
  }, (err) => {
    console.log(err.response.data)
    context.last.text = err.response.data.description.message
    context.code = err.response.status
  })
}

// Обновление по id
export function update (context, id, data) {
  let path = '/works/' + id
  api.put(path, data).then((res) => {
    localUpdate(context.works, res.data) // Вставка изменений в элемент массива, чтобы не делать дополнительный запрос на получение изменений
    context.last.text = success
    context.code = res.status
  }, (err) => {
    console.log(err.response.data)
    context.last.text = err.response.data.description.message
    context.code = err.response.status
  })
}

// Обновление на клиенте без дополнительного запроса
function localUpdate (arr, item) {
  console.log(arr)
  console.log(item)
  // TODO: Дописать обновление
}

// Удаление по id
export function remove (context, item) {
  let path = '/works/' + item.id
  api.delete(path).then((res) => {
    const index = context.works.indexOf(item)
    context.works.splice(index, 1) // Удаляем из массива, чтобы не делать дополнительный запрос на получение изменений
    context.last.text = success
    context.code = res.status
  }, (err) => {
    console.log(err.response.data)
    context.last.text = err.response.data.description.message
    context.code = err.response.status
  })
}

export default { save, get, update, remove }
