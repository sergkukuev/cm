import {api} from './../../../router/api'

const sdesc = 'Операция прошла успешно'

export default {
  save (context, data) {
    let path = '/works/create'
    api.post(path, data).then((res) => {
      context.works.push(res.data) // Вставка в массив, чтобы не делать дополнительный запрос на получение изменений
      context.snack.text = sdesc
      context.code = res.status
    }, (err) => {
      console.log(err.response.data)
      context.snack.text = err.response.data.description.message
      context.code = err.response.status
    })
  },
  get (context) {
    let path = '/works'
    api.get(path).then((res) => {
      context.works = res.data
      context.snack.text = sdesc
      context.code = res.status
    }, (err) => {
      console.log(err.response.data)
      context.snack.text = err.response.data.description.message
      context.code = err.response.status
    })
  },
  update (context, id, data) {
    let path = '/works/' + id
    api.put(path, data).then((res) => {
      update(context.works, res.data) // Вставка изменений в элемент массива, чтобы не делать дополнительный запрос на получение изменений
      context.snack.text = sdesc
      context.code = res.status
    }, (err) => {
      console.log(err.response.data)
      context.snack.text = err.response.data.description.message
      context.code = err.response.status
    })
  },
  remove (context, item) {
    let path = '/works/' + item.id
    api.delete(path).then((res) => {
      const index = context.works.indexOf(item)
      context.works.splice(index, 1) // Удаляем из массива, чтобы не делать дополнительный запрос на получение изменений
      context.snack.text = sdesc
      context.code = res.status
    }, (err) => {
      console.log(err.response.data)
      context.snack.text = err.response.data.description.message
      context.code = err.response.status
    })
  },
  // Преобразование данных к виду отправки на сервер
  format (work) {
    let res = {
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
}

function update (arr, item) {
  console.log(arr)
  console.log(item)
  // TODO: Дописать обновление
}
