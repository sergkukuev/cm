import {api} from './../../../router/api'

const sdesc = 'Операция прошла успешно'

export default {
  save (context, data) {
    let path = './kns/create'
    api.post(path, data).then((res) => {
      context.kns.push(res.data) // Вставка в массив, чтобы не делать дополнительный запрос на получение изменений
      context.code = res.status
      this.success_snack(context, sdesc)
    }, (err) => {
      console.log(err.response.data)
      context.code = err.response.status
      this.error_snack(context, err.response.data.description.message)
    })
  },
  get (context) {
    let path = '/kns'
    api.get(path).then((res) => {
      context.kns = res.data
      context.code = res.status
      this.success_snack(context, sdesc)
    }, (err) => {
      console.log(err.response.data)
      context.code = err.response.status
      this.error_snack(context, err.response.data.description.message)
    })
  },
  update (context, id, data) {
    let path = '/kns/' + id
    api.put(path, data).then((res) => {
      // Вставка изменений в элемент массива, чтобы не делать дополнительный запрос на получение изменений
      let bUpd = false
      for (let i = 0; i < context.kns.length && !bUpd; i++) {
        if (context.kns[i].id === res.data.id) {
          context.kns[i].name = res.data.name
          context.kns[i].ctgr = res.data.ctgr
          context.kns[i].sctgr = res.data.sctgr
          context.kns[i].marks = res.data.marks
          bUpd = true
        }
      }
      context.code = res.status
      this.success_snack(context, sdesc)
    }, (err) => {
      console.log(err.response.data)
      context.code = err.response.status
      this.error_snack(context, err.response.data.description.message)
    })
  },
  remove (context, item) {
    let path = '/kns/' + item.id
    api.delete(path).then((res) => {
      const index = context.kns.indexOf(item)
      context.kns.splice(index, 1) // Удаляем из массива, чтобы не делать дополнительный запрос на получение изменений
      context.code = res.status
      this.success_snack(context, sdesc)
    }, (err) => {
      console.log(err.response.data)
      context.code = err.response.status
      this.error_snack(context, err.response.data.description.message)
    })
  },
  // Отображение snackbar
  success_snack (context, msg) {
    context.snack.color = 'success'
    context.snack.text = msg
    context.snack.activator = true
  },
  error_snack (context, msg) {
    context.snack.color = 'error'
    context.snack.text = msg
    context.snack.activator = true
  },
  info_snack (context, msg) {
    context.snack.color = 'info'
    context.snack.text = msg
    context.snack.activator = true
  }
}
