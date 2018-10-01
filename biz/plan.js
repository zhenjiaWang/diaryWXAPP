const { wxPost } = require('../utils/common.js')
export default {
  data: {
    planShow: false,
    planItems: [],
    planCallLimit: 1
  },
  actionPlan: function () {
    this.setData({ planShow: true, maskShow: true })
  },
  closePlan: function () {
    this.setData({ planShow: false, maskShow: false })
  },
  callPlan: function (e) {
    const that = this
    if (that.data.userState.hours === 0 || that.data.planCallLimit===0) {
      return false
    } else {
      that.setData({ planCallLimit: 0 })
      let planId = e.currentTarget.dataset.id
      console.info(planId)
      if (planId) {
        wxPost(
          '/user/callPlan',
          {
            userId: that.data.userId,
            planId: planId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ planCallLimit:1,planShow: false, dialogShow: true, dialogText: data.text })
            }
            console.info(data)
          }
        )
      }
    }
  }
}