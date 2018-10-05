const { wxPost, isEnableBtn } = require('../utils/common.js')
export default {
  data: {
    coupleShow: false,
    jobItems: []
  },
  actionCouple: function () {
    this.setData({ coupleShow: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closeCouple: function () {
    this.setData({ coupleShow: false, maskShow: false })
    this.voiceContext().playClick()
  },
  applyCouple: function (e) {
    const that = this
    if (that.data.userState.coupleLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.voiceContext().playClick()
      that.setData({ submitFlag: true })
      let coupleId = e.currentTarget.dataset.id
      if (coupleId) {
        wxPost(
          '/user/applyCouple',
          {
            userId: that.data.userId,
            coupleId: coupleId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, coupleShow: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data, true)
            }
          }
        )
      }
    }
  }
}