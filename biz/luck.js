const { wxPost, isEnableBtn } = require('../utils/common.js')
export default {
  data: {
    luckShow: false,
    jobItems: []
  },
  actionLuck: function () {
    this.setData({ luckShow: true, maskShow: true })
  },
  closeLuck: function () {
    this.setData({ luckShow: false, maskShow: false })
  },
  applyLuck: function (e) {
    const that = this
    if (that.data.userState.luckLimit == 1 && that.data.submitFlag) {
      return false
    } else {
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
              that.setData({ submitFlag: false, luckShow: false, dialogShow: true, dialogText: data.text })
            }
            console.info(data)
          }
        )
      }
    }
  }
}