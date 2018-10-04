const { wxPost, isEnableBtn } = require('../utils/common.js')
export default {
  data: {
    myLuxuryShow: false,
    luxuryShow: false,
    luxuryItems: []
  },
  actionLuxury: function () {
    this.setData({ luxuryShow: true, maskShow: true })
  },
  closeLuxury: function () {
    this.setData({ luxuryShow: false, maskShow: false })
  },
  showMyLuxury: function () {
    this.setData({ myLuxuryShow: true, maskShow: true })
  },
  closeMyLuxury: function () {
    this.setData({ myLuxuryShow: false, maskShow: false })
  },
  buyLuxury: function (e) {
    console.info(this.data.submitFlag)
    const that = this
    if (that.data.userState.luxuryLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.setData({ submitFlag: true })
      let luxuryId = e.currentTarget.dataset.id
      if (luxuryId) {
        wxPost(
          '/user/buyLuxury',
          {
            userId: that.data.userId,
            luxuryId: luxuryId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, luxuryShow: false, dialogShow: true, dialogText: data.text })
            }
          }
        )
      }
    }
  },
  sellLuxury: function (e) {
    const that = this
    if (that.data.userState.luxuryLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.setData({ submitFlag: true })
      let luxuryId = e.currentTarget.dataset.id
      if (luxuryId) {
        wxPost(
          '/user/sellLuxury',
          {
            userId: that.data.userId,
            luxuryId: luxuryId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, myLuxuryShow: false, luxuryShow: false, dialogShow: true, dialogText: data.text })
            }
          }
        )
      }
    }
  }
}