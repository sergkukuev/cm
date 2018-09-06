import {api} from './index.js'

const success = 'Операция прошла успешно'

/* В context уходит:  kns - список всех знаний
                      last.text - последнее описание выполнения операции
                      code - код выполнения
*/

// Сохранение знания
export function save (context, data) {
  let path = '/kns/create'
  api.post(path, data).then((res) => {
    context.kns.push(res.data.content) // Вставка в массив, чтобы не делать дополнительный запрос на получение изменений
    context.last.text = success
    context.code = res.status
  }, (err) => {
    console.log(err.response.data)
    context.last.text = err.response.data.description.message
    context.code = err.response.status
  })
}

// Получение списка знаний
export function get (context) {
  let path = '/kns'
  console.log('aaa')
  api.get(path).then((res) => {
    context.kns = res.data.content
    context.last.text = success
    context.code = res.status
  }, (err) => {
    console.log(err.response.data)
    context.last.text = err.response.data.description.message
    context.code = err.response.status
  })
}

// Обновление по id
export function update (context, id, item) {
  let path = '/kns/' + id
  api.put(path, item).then((res) => {
    localUpdate(context.kns, res.data.content) // Вставка изменений в элемент массива, чтобы не делать дополнительный запрос на получение изменений
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
  let bUpd = false
  for (let i = 0; i < arr.length && !bUpd; i++) {
    if (arr[i].id === item.id) {
      arr[i].name = item.name
      arr[i].ctgr = item.ctgr
      arr[i].sctgr = item.sctgr
      arr[i].marks = item.marks
      bUpd = true
    }
  }
}

// Удаление по id
export function remove (context, item) {
  let path = '/kns/' + item.id
  api.delete(path).then((res) => {
    const index = context.kns.indexOf(item)
    context.kns.splice(index, 1) // Удаляем из массива, чтобы не делать дополнительный запрос на получение изменений
    context.last.text = success
    context.code = res.status
  }, (err) => {
    console.log(err.response.data)
    context.last.text = err.response.data.description.message
    context.code = err.response.status
  })
}

export default { save, get, update, remove }
