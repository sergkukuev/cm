import {api} from './../../../router/api'

const sdesc = 'Операция прошла успешно'
export const timeout = 10000 // Время ожидания ответа сервера

export default {
  save (context, data) {
    let path = './kns/create'
    api.post(path, data).then((res) => {
      context.kns.push(res.data) // Вставка в массив, чтобы не делать дополнительный запрос на получение изменений
      context.snack.text = sdesc
      context.code = res.status
    }, (err) => {
      console.log(err.response.data)
      context.snack.text = err.response.data.description.message
      context.code = err.response.status
    })
  },
  get (context) {
    let path = '/kns'
    context.loading = true
    api.get(path).then((res) => {
      context.kns = res.data
      context.snack.text = sdesc
      context.code = res.status
    }, (err) => {
      console.log(err.response.data)
      context.snack.text = err.response.data.description.message
      context.code = err.response.status
    })
  },
  update (context, id, data) {
    let path = '/kns/' + id
    api.put(path, data).then((res) => {
      update(context.kns, res.data) // Вставка изменений в элемент массива, чтобы не делать дополнительный запрос на получение изменений
      context.snack.text = sdesc
      context.code = res.status
    }, (err) => {
      console.log(err.response.data)
      context.snack.text = err.response.data.description.message
      context.code = err.response.status
    })
  },
  remove (context, item) {
    let path = '/kns/' + item.id
    api.delete(path).then((res) => {
      const index = context.kns.indexOf(item)
      context.kns.splice(index, 1) // Удаляем из массива, чтобы не делать дополнительный запрос на получение изменений
      context.snack.text = sdesc
      context.code = res.status
    }, (err) => {
      console.log(err.response.data)
      context.snack.text = err.response.data.description.message
      context.code = err.response.status
    })
  }
}

function update (arr, item) {
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
