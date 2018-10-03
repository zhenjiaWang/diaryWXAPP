const { wxPost, isEnableBtn } = require('../utils/common.js')
export default {
  data: {
    myCarShow: false,
    carShow: false,
    carItems: []
  },
  actionCar: function () {
    this.setData({ carShow: true, maskShow: true })
  },
  closeCar: function () {
    this.setData({ carShow: false, maskShow: false })
  },
  showMyCar: function () {
    this.setData({ myCarShow: true, maskShow: true })
  },
  closeMyCar: function () {
    this.setData({ myCarShow: false, maskShow: false })
  },
  buyCar:function(e){
    const that = this
    if (that.data.userState.carLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.setData({ submitFlag: true })
      let carId = e.currentTarget.dataset.id
      if (carId) {
        wxPost(
          '/user/buyCar',
          {
            userId: that.data.userId,
            carId: carId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, carShow: false, dialogShow: true, dialogText: data.text })
            }
            console.info(data)
          }
        )
      }
    }
  },
  sellCar: function (e) {
    const that = this
    if (that.data.userState.carLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.setData({ submitFlag: true })
      let carId = e.currentTarget.dataset.id
      if (carId) {
        wxPost(
          '/user/sellCar',
          {
            userId: that.data.userId,
            carId: carId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, myCarShow:false,carShow: false, dialogShow: true, dialogText: data.text })
            }
            console.info(data)
          }
        )
      }
    }
  }
}