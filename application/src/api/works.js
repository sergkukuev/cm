import {api} from './index'

const success = 'Операция прошла успешно'

/* В context уходит:  works - список всех направлений
                      text - описание выполнения операции
                      code - код выполнения
                      loading - статус загрузки всего списка
*/

export function save (context, data) {
  let path = '/works/create'
  api.post(path, data).then((res) => {
    context.works.push(res.data.content) // Вставка в массив, чтобы не делать дополнительный запрос на получение изменений
    context.snack.text = success
    context.code = res.status
  }, (err) => {
    console.log(err.response.data)
    context.snack.text = err.response.data.description.message
    context.code = err.response.status
  })
}

export function get (context) {
  let path = '/works'
  context.loading = true
  api.get(path).then((res) => {
    context.works = res.data.content
    context.snack.text = success
    context.code = res.status
  }, (err) => {
    console.log(err.response.data)
    context.snack.text = err.response.data.description.message
    context.code = err.response.status
  })
}

export function update (context, id, data) {
  let path = '/works/' + id
  api.put(path, data).then((res) => {
    localUpdate(context.works, res.data) // Вставка изменений в элемент массива, чтобы не делать дополнительный запрос на получение изменений
    context.snack.text = success
    context.code = res.status
  }, (err) => {
    console.log(err.response.data)
    context.snack.text = err.response.data.description.message
    context.code = err.response.status
  })
}

function localUpdate (arr, item) {
  console.log(arr)
  console.log(item)
  // TODO: Дописать обновление
}

export function remove (context, item) {
  let path = '/works/' + item.id
  api.delete(path).then((res) => {
    const index = context.works.indexOf(item)
    context.works.splice(index, 1) // Удаляем из массива, чтобы не делать дополнительный запрос на получение изменений
    context.snack.text = success
    context.code = res.status
  }, (err) => {
    console.log(err.response.data)
    context.snack.text = err.response.data.description.message
    context.code = err.response.status
  })
}

// Преобразование данных к виду отправки на сервер
// Временная (надо дописать сервер)
export function format (work) {
  let res = { // Структура отправки
    tname: [],
    trank: [],
    num_kn: [],
    id_kn: [],
    marks: []
  }
  res['name'] = work.name
  work.tasks.forEach(task => {
    res.tname.push(task.name)
    res.trank.push(task.rank.value)
    res.num_kn.push(task.need.length)
    task.need.forEach(knowledge => {
      res.id_kn.push(knowledge.id)
      res.marks.push(knowledge.mark.value)
    })
  })
  return res
}

export default { save, get, update, remove, format }
