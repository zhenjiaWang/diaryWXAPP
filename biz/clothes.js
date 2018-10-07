const { wxPost, isEnableBtn } = require('../utils/common.js')

export default {
  data: {
    myClothesShow: false,
    clothesShow: false,
    clothesItems: []
  },
  actionClothes: function () {
    this.setData({ clothesShow: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closeClothes: function () {
    this.setData({ clothesShow: false, maskShow: false })
    this.voiceContext().playClick()
  },
  showMyClothes: function () {
    this.setData({ myClothesShow: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closeMyClothes: function () {
    this.setData({ myClothesShow: false, maskShow: false })
    this.voiceContext().playClick()
  },
  buyClothes: function (e) {
    const that = this
    if (that.data.userState.clothesLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.voiceContext().playClick()
      that.setData({ submitFlag: true })
      let clothesId = e.currentTarget.dataset.id
      if (clothesId) {
        wxPost(
          '/user/buyClothes',
          {
            userId: that.data.userData.userId,
            clothesId: clothesId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, clothesShow: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data)
            }
          }
        )
      }
    }
  },
  sellClothes: function (e) {
    const that = this
    if (that.data.userState.clothesLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.voiceContext().playClick()
      that.setData({ submitFlag: true })
      let clothesId = e.currentTarget.dataset.id
      if (clothesId) {
        wxPost(
          '/user/sellClothes',
          {
            userId: that.data.userData.userId,
            clothesId: clothesId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, myClothesShow: false, clothesShow: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data)
            }
          }
        )
      }
    }
  }
}