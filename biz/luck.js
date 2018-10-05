const { wxPost, isEnableBtn } = require('../utils/common.js')
export default {
  data: {
    luckShow: false,
    jobItems: []
  },
  actionLuck: function () {
    this.setData({ luckShow: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closeLuck: function () {
    this.setData({ luckShow: false, maskShow: false })
    this.voiceContext().playClick()
  },
  applyLuck: function (e) {
    const that = this
    if (that.data.userState.luckLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.voiceContext().playClick()
      that.setData({ submitFlag: true })
      let luckId = e.currentTarget.dataset.id
      if (luckId) {
        wxPost(
          '/user/applyLuck',
          {
            userId: that.data.userId,
            luckId: luckId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, luckShow: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data,true)
            }
            console.info(data)
          }
        )
      }
    }
  }
}