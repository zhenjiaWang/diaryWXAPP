const { wxPost, isEnableBtn } = require('../utils/common.js')

export default {
  data: {
    myClothesShow: false,
    clothesShow: false,
    clothesItems: []
  },
  actionClothes: function () {
    this.setData({ clothesShow: true, maskShow: true })
  },
  closeClothes: function () {
    this.setData({ clothesShow: false, maskShow: false })
  },
  showMyClothes: function () {
    this.setData({ myClothesShow: true, maskShow: true })
  },
  closeMyClothes: function () {
    this.setData({ myClothesShow: false, maskShow: false })
  },
  buyClothes: function (e) {
    const that = this
    if (that.data.userState.clothesLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.setData({ submitFlag: true })
      let clothesId = e.currentTarget.dataset.id
      if (clothesId) {
        wxPost(
          '/user/buyClothes',
          {
            userId: that.data.userId,
            clothesId: clothesId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, clothesShow: false, dialogShow: true, dialogText: data.text })
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
      that.setData({ submitFlag: true })
      let clothesId = e.currentTarget.dataset.id
      if (clothesId) {
        wxPost(
          '/user/sellClothes',
          {
            userId: that.data.userId,
            clothesId: clothesId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, myClothesShow: false, clothesShow: false, dialogShow: true, dialogText: data.text })
            }
          }
        )
      }
    }
  }
}