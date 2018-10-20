const { wxPost, isEnableBtn, showMaskNavigationBarColor, closeMaskNavigationBarColor } = require('../utils/common.js')


const show = 'luxuryShow'
const foldShow = 'myLuxuryShow'
const items = 'luxuryItems'

export default {
  data: {
    [foldShow]: false,
    [show]: false,
    [items]: []
  },
  watch: {
    [show]: function (n, o) {
      if (!n) {
        //reset scollbar 
        const dateItem = this.data[items]
        this.setData({ [items]: [] })
        this.setData({ [items]: dateItem })
      }
    }
  },
  actionLuxury: function () {
    showMaskNavigationBarColor()
    this.setData({ [show]: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closeLuxury: function () {
    closeMaskNavigationBarColor()
    this.setData({ [show]: false, maskShow: false })
    this.voiceContext().playClick()
  },
  showMyLuxury: function () {
    showMaskNavigationBarColor()
    this.setData({ [foldShow]: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closeMyLuxury: function () {
    closeMaskNavigationBarColor()
    this.setData({ [foldShow]: false, maskShow: false })
    this.voiceContext().playClick()
  },
  buyLuxury: function (e) {
    console.info(this.data.submitFlag)
    const that = this
    if (that.data.userState.luxuryLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.voiceContext().playClick()
      that.setData({ submitFlag: true })
      let luxuryId = e.currentTarget.dataset.id
      if (luxuryId) {
        wxPost(
          '/user/buyLuxury',
          {
            userId: that.data.userData.userId,
            luxuryId: luxuryId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, [show]: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data)
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
      that.voiceContext().playClick()
      that.setData({ submitFlag: true })
      let luxuryId = e.currentTarget.dataset.id
      if (luxuryId) {
        wxPost(
          '/user/sellLuxury',
          {
            userId: that.data.userData.userId,
            luxuryId: luxuryId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, [foldShow]: false, [show]: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data)
            }
          }
        )
      }
    }
  }
}