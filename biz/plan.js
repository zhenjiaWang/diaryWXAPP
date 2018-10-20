const { wxPost, isEnableBtn, showMaskNavigationBarColor, closeMaskNavigationBarColor ,wxGet} = require('../utils/common.js')

const app=getApp()
const show = 'planShow'
const items ='planItems'

export default {
  data: {
    [show]: false,
    [items]: []
  },
  watch:{
    [show]: function (n, o) {
      if (!n) {
        //reset scollbar 
        const dateItem = this.data[items]
        this.setData({ [items]: [] })
        this.setData({ [items]: dateItem })
      }
    }
  },
  actionPlan: function () {
    if (this.hangOn) return 
    showMaskNavigationBarColor()
    this.setData({ [show]: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closePlan: function () {
    closeMaskNavigationBarColor()
    this.setData({ [show]: false, maskShow: false })
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
              that.getEventStack().push({ id:planId, category:'plan'})
              that.setData({
                findEventId:planId,
                findEventType:'plan',
                submitFlag: false, [show]: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data)
            }
            console.info(data)
          }
        )
      }
    }
  }
}