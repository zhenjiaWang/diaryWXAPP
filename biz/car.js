const { wxPost, isEnableBtn } = require('../utils/common.js')
export default {
  data: {
    myCarShow: false,
    carShow: false,
    carItems: []
  },
  actionCar: function () {
    this.setData({ carShow: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closeCar: function () {
    this.setData({ carShow: false, maskShow: false })
    this.voiceContext().playClick()
  },
  showMyCar: function () {
    this.setData({ myCarShow: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closeMyCar: function () {
    this.setData({ myCarShow: false, maskShow: false })
    this.voiceContext().playClick()
  },
  buyCar:function(e){
    const that = this
    if (that.data.userState.carLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.voiceContext().playClick()
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
              that.setData({ submitFlag: false, carShow: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data)
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
      that.voiceContext().playClick()
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
              that.setData({ submitFlag: false, myCarShow: false, carShow: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data)
            }
            console.info(data)
          }
        )
      }
    }
  }
}