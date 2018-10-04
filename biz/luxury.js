const { wxPost } = require('../utils/common.js')

const bizName='luxury'
const _bizName = bizName.charAt(0).toUpperCase + bizName.substring(1)

export default { 
  data:{
    [`${bizName}Show`]: false,
    [`${bizName}Items`]:[],
    [`${bizName}CallLimit`]:1
  },
  [`action${_bizName}`]() {
    const obj = { maskShow: true }
    obj[`${bizName}Show`] = true
    this.setData(obj)
  },
  [`close${_bizName}`] () {
    const obj = { maskShow: false }
    obj[`${bizName}Show`] = false
    this.setData(obj)
  },
  [`call${_bizName}`] (e) {
    const that = this
    if (that.data.userState.hours && that.data[`${bizName}CallLimit`]) {
      const data = {}
      data[`${bizName}CallLimit`] = 0
      that.setData(data)
      let id = e.currentTarget.dataset.id
      console.info(id)
      if (id) {
        const params = { userId: that.data.userId }
        params[`${bizName}Id`] = id
        wxPost(`/user/call${_bizName}`, params,
          ({ data }) => {
            if (data.errorCode >= 0) {
              const dialogData = {
                dialogShow: true,
                dialogText: data.text
              }
              dialogData[`${bizName}Show`] = false
              that.setData(dialogData)
            }
            console.info(data)
          }
        )
      }
    }
  }
 }