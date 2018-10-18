const { wxPost, isEnableBtn, showMaskNavigationBarColor, closeMaskNavigationBarColor } = require('../utils/common.js')

const app=getApp()

export default {
  data: {
    planShow: false,
    planItems: []
  },
  actionPlan: function () {
    showMaskNavigationBarColor()
    this.setData({ planShow: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closePlan: function () {
    closeMaskNavigationBarColor()
    this.setData({ planShow: false, maskShow: false })
    this.voiceContext().playClick()
  },
  applyPlan: function (e) {
    const that = this
    if (that.data.submitFlag) {
      return false
    } else {
      that.voiceContext().playClick()
      that.setData({ submitFlag: true })
      let planId = e.currentTarget.dataset.id
      console.info(planId)
      if (planId) {
        wxPost(
          '/user/applyPlan',
          {
            userId: that.data.userData.userId,
            planId: planId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({
                findEventId:planId,
                findEventType:'plan',
                submitFlag: false, planShow: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data)
            }
            console.info(data)
          }
        )
      }
    }
  }
}