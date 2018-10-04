const { wxPost, isEnableBtn } = require('../utils/common.js')
export default {
  data: {
    myHouseShow: false,
    houseShow: false,
    houseItems: []
  },
  actionHouse: function () {
    this.setData({ houseShow: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closeHouse: function () {
    this.setData({ houseShow: false, maskShow: false })
    this.voiceContext().playClick()
  },
  showMyHouse: function () {
    this.setData({ myHouseShow: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closeMyHouse: function () {
    this.setData({ myHouseShow: false, maskShow: false })
    this.voiceContext().playClick()
  },
  buyHouse: function (e) {
    const that = this
    if (that.data.userState.houseLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.voiceContext().playClick()
      that.setData({ submitFlag: true })
      let houseId = e.currentTarget.dataset.id
      if (houseId) {
        wxPost(
          '/user/buyHouse',
          {
            userId: that.data.userId,
            houseId: houseId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, houseShow: false, dialogShow: true, dialogText: data.text })
              that.resultVoice(data)
            }
            console.info(data)
          }
        )
      }
    }
  },
  sellHouse: function (e) {
    const that = this
    if (that.data.userState.houseLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.setData({ submitFlag: true })
      let houseId = e.currentTarget.dataset.id
      if (houseId) {
        wxPost(
          '/user/sellHouse',
          {
            userId: that.data.userId,
            houseId: houseId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, myHouseShow: false, houseShow: false, dialogShow: true, dialogText: data.text })
            }
            console.info(data)
          }
        )
      }
    }
  }
}